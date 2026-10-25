import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { names, imageFilename } from './characters';
type Pos = { x: number; y: number };
type Labels = { xLeft:string;xRight:string;yBottom:string;yTop:string;xTitle:string;yTitle:string };
type Saved = { positions:Record<string,Pos>;labels:Labels };
const defaults:Labels={xLeft:'Weak',xRight:'Strong',yBottom:'Difficult',yTop:'Easy',xTitle:'Character strength',yTitle:'Ease of use'};
const key='genshin-graph-v1';
function initial():Saved {try {const v=JSON.parse(localStorage.getItem(key)||'null');if(v?.positions&&v?.labels)return {positions:v.positions,labels:{...defaults,...v.labels}};}catch{}return {positions:{},labels:defaults};}
function Portrait({name}:{name:string}) {
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[name]);
  return <span className="portrait">{!failed?<img draggable={false} src={`${import.meta.env.BASE_URL}characters/${imageFilename(name)}`} alt={name} onError={()=>setFailed(true)}/>:<span>{name.split(' ').map(w=>w[0]).join('').slice(0,2)}</span>}</span>;
}
export default function App(){
 const [data,setData]=useState<Saved>(initial);
 const [query,setQuery]=useState('');
 const [size,setSize]=useState(52);
 const graph=useRef<HTMLDivElement>(null);
 const exportRef=useRef<HTMLDivElement>(null);
 const drag=useRef<{name:string;pointerId:number}|null>(null);
 const [active,setActive]=useState<string|null>(null);
 useEffect(()=>localStorage.setItem(key,JSON.stringify(data)),[data]);
 const setLabel=(k:keyof Labels,v:string)=>setData(d=>({...d,labels:{...d.labels,[k]:v}}));
 const coords=(clientX:number,clientY:number):Pos=>{
   const r=graph.current!.getBoundingClientRect();
   return {x:Math.max(0,Math.min(1,(clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,1-(clientY-r.top)/r.height))};
 };
 const place=(name:string,x:number,y:number)=>setData(d=>({...d,positions:{...d.positions,[name]:coords(x,y)}}));
 const remove=(name:string)=>setData(d=>{const positions={...d.positions};delete positions[name];return {...d,positions};});
 const onStart=(e:React.PointerEvent,name:string)=>{
   if(e.button!==0)return;
   drag.current={name,pointerId:e.pointerId};setActive(name);
   (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
 };
 const onMove=(e:React.PointerEvent)=>{
   if(!drag.current||drag.current.pointerId!==e.pointerId)return;
   const r=graph.current?.getBoundingClientRect();
   if(r&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)place(drag.current.name,e.clientX,e.clientY);
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
      remove(name);
    }
  }

  drag.current = null;
  setActive(null);
};
 const onCancel=()=>{drag.current=null;setActive(null);};
 const download=async()=>{if(!exportRef.current)return;try{
   const url=await toPng(exportRef.current,{pixelRatio:2,backgroundColor:'#151d2c'});
   const a=document.createElement('a');a.href=url;a.download='genshin-character-graph.png';a.click();
 }catch(e){alert('Could not export image. Check that portraits are hosted locally.');console.error(e);}};
 const placed=Object.entries(data.positions);
 const remaining=names.filter(n=>!(n in data.positions)&&n.toLowerCase().includes(query.toLowerCase()));
 return <main onPointerMove={onMove} onPointerUp={onEnd} onPointerCancel={onCancel}>
   <header><div><h1>Genshin Character Graph</h1><p>Drag characters from the tray onto the graph. Your changes save automatically in this browser.</p></div><div className="actions"><button onClick={download}>Export PNG</button><button className="danger" onClick={()=>{if(confirm('Clear all placed characters?'))setData(d=>({...d,positions:{}}));}}>Clear graph</button></div></header>
   <section className="layout">
    <div className="chart-wrap" ref={exportRef}>
     <div className="top-label">{data.labels.yTop}</div>
     <div className="chart-row"><div className="vertical-title">{data.labels.yTitle}</div><div className="graph" ref={graph} aria-label="Character positioning graph">
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
   <section className="tray"><div className="tray-header"><h2>Characters <small>({remaining.length} unplaced)</small></h2><input placeholder="Search characters..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
     <div className="characters">{remaining.map(name=><div className={`tile ${active===name?'active':''}`} key={name} onPointerDown={e=>onStart(e,name)} title={name}><Portrait name={name}/><span>{name}</span></div>)}</div>
   </section>
   <footer>Tip: drag a placed portrait back into the tray to remove it. Progress is stored locally, not shared between devices.</footer>
 </main>;
}
