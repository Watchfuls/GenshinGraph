import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { toPng } from 'html-to-image';
import { characters, elements, imageFilename, weapons, type Element, type Weapon } from './characters';
type Pos = { x: number; y: number };
type Labels = { xLeft:string;xRight:string;yBottom:string;yTop:string;xTitle:string;yTitle:string };
type GraphSettings = {
  portraitSize:number;
  portraitShape:'circle'|'rounded'|'square';
  showAxisNumbers:boolean;
  xMin:number;
  xMax:number;
  yMin:number;
  yMax:number;
  xDivisions:number;
  yDivisions:number;
  showGrid:boolean;
  gridOpacity:number;
  showCenterLines:boolean;
  gridColor:string;
  backgroundColor:string;
  portraitBorderColor:string;
};
type AppearanceTab='axes'|'grid'|'portraits';
type Saved = { positions:Record<string,Pos>;labels:Labels;order:string[];settings:GraphSettings };
const defaults:Labels={xLeft:'Weak',xRight:'Strong',yBottom:'Difficult',yTop:'Easy',xTitle:'Character strength',yTitle:'Ease of use'};
const defaultSettings:GraphSettings={portraitSize:52,portraitShape:'circle',showAxisNumbers:false,xMin:0,xMax:100,yMin:0,yMax:100,xDivisions:10,yDivisions:10,showGrid:true,gridOpacity:20,showCenterLines:true,gridColor:'#ffffff',backgroundColor:'#182439',portraitBorderColor:'#b6c8e4'};
const key='genshin-graph-v1';
const defaultOrder=characters.map(character=>character.name);
const boundedNumber=(value:unknown,fallback:number,min:number,max:number)=>typeof value==='number'&&Number.isFinite(value)?Math.max(min,Math.min(max,value)):fallback;
const formatAxisNumber=(value:number)=>new Intl.NumberFormat('en-US',{
  notation:Math.abs(value)>=1_000_000?'compact':'standard',
  maximumSignificantDigits:4,
}).format(value);
function validOrder(order:unknown):string[] {
  const knownNames=new Set(defaultOrder);
  const savedOrder=Array.isArray(order)?order.filter((name):name is string=>typeof name==='string'&&knownNames.has(name)):[];
  return [...new Set(savedOrder),...defaultOrder.filter(name=>!savedOrder.includes(name))];
}
function initial():Saved {try {const v=JSON.parse(localStorage.getItem(key)||'null');if(v?.positions&&v?.labels){const saved=v.settings||{};const xMin=boundedNumber(saved.xMin,defaultSettings.xMin,-1e9,1e9);const xMax=boundedNumber(saved.xMax,defaultSettings.xMax,-1e9,1e9);const yMin=boundedNumber(saved.yMin,defaultSettings.yMin,-1e9,1e9);const yMax=boundedNumber(saved.yMax,defaultSettings.yMax,-1e9,1e9);return {positions:v.positions,labels:{...defaults,...v.labels},order:validOrder(v.order),settings:{...defaultSettings,...saved,portraitSize:boundedNumber(saved.portraitSize,defaultSettings.portraitSize,24,180),xMin:xMin<xMax?xMin:defaultSettings.xMin,xMax:xMin<xMax?xMax:defaultSettings.xMax,yMin:yMin<yMax?yMin:defaultSettings.yMin,yMax:yMin<yMax?yMax:defaultSettings.yMax,xDivisions:Math.round(boundedNumber(saved.xDivisions??saved.gridDivisions,defaultSettings.xDivisions,1,20)),yDivisions:Math.round(boundedNumber(saved.yDivisions??saved.gridDivisions,defaultSettings.yDivisions,1,20)),gridOpacity:boundedNumber(saved.gridOpacity,defaultSettings.gridOpacity,0,100)}};}}catch{}return {positions:{},labels:defaults,order:defaultOrder,settings:defaultSettings};}
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
 const [axisDrafts,setAxisDrafts]=useState<Record<string,string>>({});
 const [appearanceTab,setAppearanceTab]=useState<AppearanceTab>('axes');
 const graph=useRef<HTMLDivElement>(null);
 const exportRef=useRef<HTMLDivElement>(null);
 const drag=useRef<{name:string;pointerId:number}|null>(null);
 const trayOrderDrag=useRef<string|null>(null);
 const [trayDropTarget,setTrayDropTarget]=useState<{name:string;side:'before'|'after'}|null>(null);
 const [active,setActive]=useState<string|null>(null);
 useEffect(()=>localStorage.setItem(key,JSON.stringify(data)),[data]);
 const setLabel=(k:keyof Labels,v:string)=>setData(d=>({...d,labels:{...d.labels,[k]:v}}));
 const setSetting=<K extends keyof GraphSettings,>(key:K,value:GraphSettings[K])=>setData(d=>({...d,settings:{...d.settings,[key]:value}}));
 const setAxisBound=(axis:'x'|'y',bound:'Min'|'Max',value:number)=>{
   if(!Number.isFinite(value))return;
   const minKey=`${axis}Min` as 'xMin'|'yMin';
   const maxKey=`${axis}Max` as 'xMax'|'yMax';
   const next=Math.max(-1e9,Math.min(1e9,value));
   setData(d=>{
     const min=d.settings[minKey],max=d.settings[maxKey];
     let settings=d.settings;
     if(bound==='Min'){
       if(next<max)settings={...d.settings,[minKey]:next};
       else if(next<1e9)settings={...d.settings,[minKey]:next,[maxKey]:next+1};
       else settings={...d.settings,[minKey]:1e9-1,[maxKey]:1e9};
     }else if(next>min)settings={...d.settings,[maxKey]:next};
     else if(next>-1e9)settings={...d.settings,[minKey]:next-1,[maxKey]:next};
     else settings={...d.settings,[minKey]:-1e9,[maxKey]:-1e9+1};
     return {...d,settings};
   });
 };
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
   <header><div><h1>Genshin Character Graph</h1><p>Drag characters from the tray onto the graph. Your changes save automatically in this browser.</p></div><div className="header-right"><div className="related-sites" role="navigation" aria-label="More Genshin tools"><a href="https://watchfuls.github.io/imaginarium-theater-planner/">Theater Planner</a><span aria-hidden="true">·</span><a href="https://watchfuls.github.io/genshinpuzzle/">Dummy Guesser</a></div><div className="actions"><button onClick={download}>Export PNG</button><button className="danger" onClick={()=>{if(confirm('Clear all placed characters?'))setData(d=>({...d,positions:{}}));}}>Clear graph</button></div></div></header>
   <section className="layout">
    <div className="chart-wrap" ref={exportRef}>
     <div className="top-label">{data.labels.yTop}</div>
     <div className="chart-row"><div className="vertical-title">{data.labels.yTitle}</div><div className={`graph ${data.settings.showGrid?'':'no-grid'}`} ref={graph} aria-label="Character positioning graph" style={{'--grid-size-x':`${100/data.settings.xDivisions}%`,'--grid-size-y':`${100/data.settings.yDivisions}%`,'--grid-color':data.settings.gridColor,'--grid-opacity':`${data.settings.gridOpacity}%`,'--graph-background':data.settings.backgroundColor,'--portrait-border':data.settings.portraitBorderColor} as CSSProperties} onDragOver={e=>{if(e.dataTransfer.types.includes('application/x-genshin-character')){e.preventDefault();e.dataTransfer.dropEffect='move';}}} onDrop={e=>{const name=e.dataTransfer.getData('application/x-genshin-character');if(name&&characters.some(character=>character.name===name)){e.preventDefault();place(name,e.clientX,e.clientY);trayOrderDrag.current=null;setTrayDropTarget(null);setActive(null);}}}>
       {data.settings.showCenterLines&&<><div className="midline horizontal"/><div className="midline vertical"/></>}
       {data.settings.showAxisNumbers&&Array.from({length:data.settings.xDivisions+1},(_,index)=><span key={`x-${index}`} className={`axis-tick axis-tick-x ${index===0?'start':index===data.settings.xDivisions?'end':''}`} style={{left:`${index/data.settings.xDivisions*100}%`}}>{formatAxisNumber(data.settings.xMin+(data.settings.xMax-data.settings.xMin)*index/data.settings.xDivisions)}</span>)}
       {data.settings.showAxisNumbers&&Array.from({length:data.settings.yDivisions+1},(_,index)=><span key={`y-${index}`} className={`axis-tick axis-tick-y ${index===0?'end':index===data.settings.yDivisions?'start':''}`} style={{top:`${(1-index/data.settings.yDivisions)*100}%`}}>{formatAxisNumber(data.settings.yMin+(data.settings.yMax-data.settings.yMin)*index/data.settings.yDivisions)}</span>)}
       {placed.map(([name,p])=><div key={name} className={`point ${active===name?'active':''} portrait-${data.settings.portraitShape}`} style={{left:`${p.x*100}%`,top:`${(1-p.y)*100}%`,width:data.settings.portraitSize,height:data.settings.portraitSize}} onPointerDown={e=>onStart(e,name)} aria-label={name}><Portrait name={name}/><span className="point-name">{name}</span></div>)}
     </div></div>
     <div className="bottom-label">{data.labels.yBottom}</div>
     <div className="x-ends"><span>{data.labels.xLeft}</span><span>{data.labels.xRight}</span></div>
     <div className="x-title">{data.labels.xTitle}</div>
    </div>
    <aside><h2>Axis labels</h2>{([
      ['xTitle','X-axis title'],['xLeft','Left'],['xRight','Right'],
      ['yTitle','Y-axis title'],['yBottom','Bottom'],['yTop','Top']
     ] as [keyof Labels,string][]).map(([k,label])=><label key={k}>{label}<input value={data.labels[k]} onChange={e=>setLabel(k,e.target.value)} /></label>)}
     <label>Portrait size: {data.settings.portraitSize}px<input type="range" min="24" max="180" value={data.settings.portraitSize} onChange={e=>setSetting('portraitSize',Number(e.target.value))}/><input aria-label="Portrait size in pixels" type="number" min="24" max="180" value={data.settings.portraitSize} onChange={e=>setSetting('portraitSize',boundedNumber(Number(e.target.value),data.settings.portraitSize,24,180))}/></label>
     <button onClick={()=>setData(d=>({...d,labels:defaults}))}>Reset labels</button>
     <details className="appearance-settings"><summary>Graph customization</summary>
       <div className="appearance-tabs" role="tablist" aria-label="Graph customization categories" onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const tabs:AppearanceTab[]=['axes','grid','portraits'];const direction=e.key==='ArrowRight'?1:-1;const next=tabs[(tabs.indexOf(appearanceTab)+direction+tabs.length)%tabs.length];setAppearanceTab(next);document.getElementById(`appearance-tab-${next}`)?.focus();}}}>
         {([{id:'axes',label:'Axes'},{id:'grid',label:'Grid & background'},{id:'portraits',label:'Portraits'}] as {id:AppearanceTab;label:string}[]).map(tab=><button type="button" role="tab" id={`appearance-tab-${tab.id}`} aria-selected={appearanceTab===tab.id} aria-controls="appearance-panel" tabIndex={appearanceTab===tab.id?0:-1} className={appearanceTab===tab.id?'selected':''} key={tab.id} onClick={()=>setAppearanceTab(tab.id)}>{tab.label}</button>)}
       </div>
       <div className="appearance-panel" role="tabpanel" id="appearance-panel" aria-labelledby={`appearance-tab-${appearanceTab}`}>
       {appearanceTab==='axes'&&<>
         <label className="checkbox-setting"><input type="checkbox" checked={data.settings.showAxisNumbers} onChange={e=>setSetting('showAxisNumbers',e.target.checked)}/>Show numbers on axes</label>
         {(['x','y'] as const).map(axis=><fieldset className="axis-settings" key={axis}><legend>{axis.toUpperCase()} axis</legend><div className="number-fields">
           <label>Minimum<input type="number" step="any" value={axisDrafts[`${axis}Min`]??data.settings[`${axis}Min`]} onChange={e=>{const value=e.target.value;setAxisDrafts(d=>({...d,[`${axis}Min`]:value}));if(value.trim()!==''&&Number.isFinite(Number(value)))setAxisBound(axis,'Min',Number(value));}} onBlur={()=>{setAxisDrafts(d=>{const next={...d};delete next[`${axis}Min`];return next;});}}/></label>
           <label>Maximum<input type="number" step="any" value={axisDrafts[`${axis}Max`]??data.settings[`${axis}Max`]} onChange={e=>{const value=e.target.value;setAxisDrafts(d=>({...d,[`${axis}Max`]:value}));if(value.trim()!==''&&Number.isFinite(Number(value)))setAxisBound(axis,'Max',Number(value));}} onBlur={()=>{setAxisDrafts(d=>{const next={...d};delete next[`${axis}Max`];return next;});}}/></label>
           <label>Divisions<input type="number" min="1" max="20" step="1" value={data.settings[`${axis}Divisions`]} onChange={e=>setSetting(`${axis}Divisions`,Math.round(boundedNumber(Number(e.target.value),data.settings[`${axis}Divisions`],1,20)))}/></label>
         </div></fieldset>)}
       </>}
       {appearanceTab==='grid'&&<>
         <label className="checkbox-setting"><input type="checkbox" checked={data.settings.showGrid} onChange={e=>setSetting('showGrid',e.target.checked)}/>Show grid</label>
         <label>Grid opacity: {data.settings.gridOpacity}%<input type="range" min="0" max="100" value={data.settings.gridOpacity} onChange={e=>setSetting('gridOpacity',Number(e.target.value))}/></label>
         <label className="checkbox-setting"><input type="checkbox" checked={data.settings.showCenterLines} onChange={e=>setSetting('showCenterLines',e.target.checked)}/>Show center lines</label>
         <label>Grid color<input className="color-input" type="color" value={data.settings.gridColor} onChange={e=>setSetting('gridColor',e.target.value)}/></label>
         <label>Graph background<input className="color-input" type="color" value={data.settings.backgroundColor} onChange={e=>setSetting('backgroundColor',e.target.value)}/></label>
       </>}
       {appearanceTab==='portraits'&&<>
         <label>Portrait shape<select value={data.settings.portraitShape} onChange={e=>{const shape=e.target.value;if(shape==='circle'||shape==='rounded'||shape==='square')setSetting('portraitShape',shape);}}><option value="circle">Circle</option><option value="rounded">Rounded square</option><option value="square">Square</option></select></label>
         <label>Portrait border<input className="color-input" type="color" value={data.settings.portraitBorderColor} onChange={e=>setSetting('portraitBorderColor',e.target.value)}/></label>
       </>}
       </div>
       <button type="button" onClick={()=>{setAxisDrafts({});setData(d=>({...d,settings:defaultSettings}));}}>Reset appearance</button>
     </details>
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
