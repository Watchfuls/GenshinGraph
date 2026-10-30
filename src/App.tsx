import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { characters, elements, imageFilename, weapons, type Element, type Weapon } from './characters';
type Pos = { x: number; y: number };
type Labels = { xLeft:string;xRight:string;yBottom:string;yTop:string;xTitle:string;yTitle:string };
type Saved = { positions:Record<string,Pos>;labels:Labels;order:string[] };
const defaults:Labels={xLeft:'Weak',xRight:'Strong',yBottom:'Difficult',yTop:'Easy',xTitle:'Character strength',yTitle:'Ease of use'};
const key='genshin-graph-v1';
const defaultOrder=characters.map(character=>character.name);
function validOrder(order:unknown):string[] {
  const knownNames=new Set(defaultOrder);
  const savedOrder=Array.isArray(order)?order.filter((name):name is string=>typeof name==='string'&&knownNames.has(name)):[];
  return [...new Set(savedOrder),...defaultOrder.filter(name=>!savedOrder.includes(name))];
}
function initial():Saved {try {const v=JSON.parse(localStorage.getItem(key)||'null');if(v?.positions&&v?.labels)return {positions:v.positions,labels:{...defaults,...v.labels},order:validOrder(v.order)};}catch{}return {positions:{},labels:defaults,order:defaultOrder};}
function Portrait({name}:{name:string}) {
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[name]);
  return <span className="portrait">{!failed?<img draggable={false} src={`${import.meta.env.BASE_URL}icons/characters/${imageFilename(name)}`} alt={name} onError={()=>setFailed(true)}/>:<span>{name.split(' ').map(w=>w[0]).join('').slice(0,2)}</span>}</span>;
}
const weaponIconUrl:Record<Weapon,string>={
 Bow:'https://static.wikia.nocookie.net/gensin-impact/images/8/81/Icon_Bow.png',
 Catalyst:'https://static.wikia.nocookie.net/gensin-impact/images/2/27/Icon_Catalyst.png',
 Claymore:'https://static.wikia.nocookie.net/gensin-impact/images/6/66/Icon_Claymore.png',
 Polearm:'https://static.wikia.nocookie.net/gensin-impact/images/6/6a/Icon_Polearm.png',
 Sword:'https://static.wikia.nocookie.net/gensin-impact/images/8/81/Icon_Sword.png'
};
export default function App(){
 const [data,setData]=useState<Saved>(initial);
 const [query,setQuery]=useState('');
 const [weaponFilters,setWeaponFilters]=useState<Weapon[]>([]);
 const [elementFilters,setElementFilters]=useState<Element[]>([]);
 const [rarityFilters,setRarityFilters]=useState<(4|5)[]>([]);
 const [size,setSize]=useState(52);
 const graph=useRef<HTMLDivElement>(null);
 const exportRef=useRef<HTMLDivElement>(null);
 const drag=useRef<{name:string;pointerId:number}|null>(null);
 const trayOrderDrag=useRef<string|null>(null);
 const [trayDropTarget,setTrayDropTarget]=useState<{name:string;side:'before'|'after'}|null>(null);
 const [active,setActive]=useState<string|null>(null);
 useEffect(()=>localStorage.setItem(key,JSON.stringify(data)),[data]);
 const setLabel=(k:keyof Labels,v:string)=>setData(d=>({...d,labels:{...d.labels,[k]:v}}));
 const toggleFilter=<T extends string|number,>(values:T[],setValues:(next:(current:T[])=>T[])=>void,value:T)=>setValues(current=>current.includes(value)?current.filter(item=>item!==value):[...current,value]);
 const coords=(clientX:number,clientY:number):Pos=>{
   const r=graph.current!.getBoundingClientRect();
   return {x:Math.max(0,Math.min(1,(clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,1-(clientY-r.top)/r.height))};
 };
 const place=(name:string,x:number,y:number)=>setData(d=>({...d,positions:{...d.positions,[name]:coords(x,y)}}));
 const unplaceAtTray=(name:string,target?:string,after=false)=>setData(d=>{
   const positions={...d.positions};
   delete positions[name];
   if(!target||target===name)return {...d,positions};
   const order=d.order.filter(character=>character!==name);
   const targetIndex=order.indexOf(target);
   if(targetIndex<0)return {...d,positions};
   order.splice(targetIndex+(after?1:0),0,name);
   return {...d,positions,order};
 });
 const reorderTray=(name:string,target:string,after=false)=>{
   if(name===target)return;
   setData(d=>{
     const order=d.order.filter(character=>character!==name);
     const targetIndex=order.indexOf(target);
     if(targetIndex<0||!d.order.includes(name))return d;
     order.splice(targetIndex+(after?1:0),0,name);
     return {...d,order};
   });
 };
 const moveTrayCharacter=(name:string,direction:-1|1)=>{
   setData(d=>{
     const order=[...d.order];
     const index=order.indexOf(name);
     const target=index+direction;
     if(index<0||target<0||target>=order.length)return d;
     [order[index],order[target]]=[order[target],order[index]];
     return {...d,order};
   });
 };
 const onStart=(e:React.PointerEvent,name:string)=>{
   if(e.button!==0)return;
   drag.current={name,pointerId:e.pointerId};setActive(name);
   (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
 };
 const onMove=(e:React.PointerEvent)=>{
   if(!drag.current||drag.current.pointerId!==e.pointerId)return;
   const r=graph.current?.getBoundingClientRect();
   if(r&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){
     place(drag.current.name,e.clientX,e.clientY);
     setTrayDropTarget(null);
   }else{
     const tile=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('.tile[data-character-name]');
     const target=tile?.dataset.characterName;
     if(target){
       const bounds=tile.getBoundingClientRect();
       setTrayDropTarget({name:target,side:e.clientX<bounds.left+bounds.width/2?'before':'after'});
     }else{
       setTrayDropTarget(null);
     }
   }
 };
const onEnd = (e: React.PointerEvent) => {
  if (!drag.current) return;

  const name = drag.current.name;
  const graphRect = graph.current?.getBoundingClientRect();

  // Check whether the pointer is inside the graph
  if (
    graphRect &&
    e.clientX >= graphRect.left &&
    e.clientX <= graphRect.right &&
    e.clientY >= graphRect.top &&
    e.clientY <= graphRect.bottom
  ) {
    place(name, e.clientX, e.clientY);
  } else {
    // Check what's actually underneath the pointer
    const elementUnderPointer = document.elementFromPoint(
      e.clientX,
      e.clientY
    );

    if (elementUnderPointer?.closest('.tray')) {
      const tile=elementUnderPointer.closest<HTMLElement>('.tile[data-character-name]');
      const target=tile?.dataset.characterName;
      const bounds=tile?.getBoundingClientRect();
      unplaceAtTray(name,target,bounds?e.clientX>bounds.left+bounds.width/2:false);
    }
  }

  drag.current = null;
  setTrayDropTarget(null);
  setActive(null);
};
 const onCancel=()=>{drag.current=null;setTrayDropTarget(null);setActive(null);};
 const download=async()=>{if(!exportRef.current)return;try{
   const url=await toPng(exportRef.current,{pixelRatio:2,backgroundColor:'#151d2c'});
   const a=document.createElement('a');a.href=url;a.download='genshin-character-graph.png';a.click();
 }catch(e){alert('Could not export image. Check that portraits are hosted locally.');console.error(e);}};
 const placed=Object.entries(data.positions);
 const orderIndex=new Map(data.order.map((name,index)=>[name,index]));
 const remaining=characters.filter(character=>
   !(character.name in data.positions)
   &&character.name.toLowerCase().includes(query.toLowerCase())
   &&(weaponFilters.length===0||weaponFilters.includes(character.weapon))
   &&(elementFilters.length===0||elementFilters.includes(character.element))
   &&(rarityFilters.length===0||rarityFilters.includes(character.rarity))
 ).sort((a,b)=>(orderIndex.get(a.name)??0)-(orderIndex.get(b.name)??0));
 const hasFilters=query.length>0||weaponFilters.length>0||elementFilters.length>0||rarityFilters.length>0;
 const hasCustomOrder=data.order.some((name,index)=>name!==defaultOrder[index]);
 return <main onPointerMove={onMove} onPointerUp={onEnd} onPointerCancel={onCancel}>
   <header><div><h1>Genshin Character Graph</h1><p>Drag characters from the tray onto the graph. Your changes save automatically in this browser.</p></div><div className="actions"><button onClick={download}>Export PNG</button><button className="danger" onClick={()=>{if(confirm('Clear all placed characters?'))setData(d=>({...d,positions:{}}));}}>Clear graph</button></div></header>
   <section className="layout">
    <div className="chart-wrap" ref={exportRef}>
     <div className="top-label">{data.labels.yTop}</div>
     <div className="chart-row"><div className="vertical-title">{data.labels.yTitle}</div><div className="graph" ref={graph} aria-label="Character positioning graph" onDragOver={e=>{if(e.dataTransfer.types.includes('application/x-genshin-character')){e.preventDefault();e.dataTransfer.dropEffect='move';}}} onDrop={e=>{const name=e.dataTransfer.getData('application/x-genshin-character');if(name&&characters.some(character=>character.name===name)){e.preventDefault();place(name,e.clientX,e.clientY);trayOrderDrag.current=null;setTrayDropTarget(null);setActive(null);}}}>
       <div className="midline horizontal"/><div className="midline vertical"/>
       {placed.map(([name,p])=><div key={name} className={`point ${active===name?'active':''}`} style={{left:`${p.x*100}%`,top:`${(1-p.y)*100}%`,width:size,height:size}} onPointerDown={e=>onStart(e,name)} title={name}><Portrait name={name}/></div>)}
     </div></div>
     <div className="bottom-label">{data.labels.yBottom}</div>
     <div className="x-ends"><span>{data.labels.xLeft}</span><span>{data.labels.xRight}</span></div>
     <div className="x-title">{data.labels.xTitle}</div>
    </div>
    <aside><h2>Axis labels</h2>{([
      ['xTitle','X-axis title'],['xLeft','Left'],['xRight','Right'],
      ['yTitle','Y-axis title'],['yBottom','Bottom'],['yTop','Top']
     ] as [keyof Labels,string][]).map(([k,label])=><label key={k}>{label}<input value={data.labels[k]} onChange={e=>setLabel(k,e.target.value)} /></label>)}
     <label>Portrait size: {size}px<input type="range" min="30" max="90" value={size} onChange={e=>setSize(Number(e.target.value))}/></label>
     <button onClick={()=>setData(d=>({...d,labels:defaults}))}>Reset labels</button>
    </aside>
   </section>
   <section className="tray"><div className="tray-header"><h2>Characters <small>({remaining.length} unplaced · drag tiles to reorder)</small></h2><div className="tray-header-actions"><input aria-label="Search characters" placeholder="Search characters..." value={query} onChange={e=>setQuery(e.target.value)}/><button type="button" className="reset-order" disabled={!hasCustomOrder} onClick={()=>setData(d=>({...d,order:defaultOrder}))}>Reset order</button></div></div>
     <div className="tray-filters">
       <div className="filter-group" role="group" aria-label="Filter by weapon">
         <span className="filter-label">Weapon</span>
         <div className="filter-options">{weapons.map(weapon=><button type="button" key={weapon} className={`filter-chip weapon-filter ${weaponFilters.includes(weapon)?'selected':''}`} aria-label={`${weaponFilters.includes(weapon)?'Remove':'Filter by'} ${weapon}`} aria-pressed={weaponFilters.includes(weapon)} title={weapon} onClick={()=>toggleFilter(weaponFilters,setWeaponFilters,weapon)}><img src={weaponIconUrl[weapon]} alt=""/></button>)}</div>
       </div>
       <div className="filter-group" role="group" aria-label="Filter by element">
         <span className="filter-label">Element</span>
         <div className="filter-options">{elements.map(element=><button type="button" key={element} className={`filter-chip element-filter ${elementFilters.includes(element)?'selected':''}`} aria-label={`${elementFilters.includes(element)?'Remove':'Filter by'} ${element}`} aria-pressed={elementFilters.includes(element)} title={element} onClick={()=>toggleFilter(elementFilters,setElementFilters,element)}><img src={`${import.meta.env.BASE_URL}icons/elements/${element}_Icon.png`} alt=""/></button>)}</div>
       </div>
       <div className="filter-group" role="group" aria-label="Filter by rarity">
         <span className="filter-label">Rarity</span>
         <div className="filter-options">{([4,5] as const).map(rarity=><button type="button" key={rarity} className={`filter-chip ${rarityFilters.includes(rarity)?'selected':''}`} aria-pressed={rarityFilters.includes(rarity)} onClick={()=>toggleFilter(rarityFilters,setRarityFilters,rarity)}>{rarity}★</button>)}</div>
       </div>
       {hasFilters&&<button type="button" className="clear-filters" onClick={()=>{setQuery('');setWeaponFilters([]);setElementFilters([]);setRarityFilters([]);}}>Clear filters</button>}
     </div>
     {remaining.length>0?<div className="characters">{remaining.map(({name})=><div className={`tile ${active===name?'active':''} ${trayDropTarget?.name===name?`reorder-${trayDropTarget.side}`:''}`} key={name} data-character-name={name} draggable tabIndex={0} aria-label={`Reorder ${name} with drag and drop or arrow keys`} aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight" onKeyDown={e=>{if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();moveTrayCharacter(name,-1);}else if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();moveTrayCharacter(name,1);}}} onDragStart={e=>{trayOrderDrag.current=name;setActive(name);e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('application/x-genshin-character',name);}} onDragOver={e=>{if(trayOrderDrag.current){e.preventDefault();e.dataTransfer.dropEffect='move';const bounds=e.currentTarget.getBoundingClientRect();setTrayDropTarget({name,side:e.clientX<bounds.left+bounds.width/2?'before':'after'});}}} onDrop={e=>{const dragged=trayOrderDrag.current;if(!dragged)return;e.preventDefault();const bounds=e.currentTarget.getBoundingClientRect();const side=e.clientX<bounds.left+bounds.width/2?'before':'after';reorderTray(dragged,name,side==='after');trayOrderDrag.current=null;setTrayDropTarget(null);setActive(null);}} onDragEnd={()=>{trayOrderDrag.current=null;setTrayDropTarget(null);setActive(null);}} title={`${name} — drag to reorder`}><Portrait name={name}/><span>{name}</span></div>)}</div>:<p className="empty-tray">No unplaced characters match these filters.</p>}
   </section>
   <footer>Tip: drag a placed portrait back into the tray to remove it. Progress is stored locally, not shared between devices.</footer>
 </main>;
}
