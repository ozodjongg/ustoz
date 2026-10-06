import Link from 'next/link';
import { useEffect, useState } from 'react';
import unitData from '../unit.json';
import { storage } from '../lib/storage';
import type { MistakeStats, UnitFile } from '../types';
const data=unitData as UnitFile;
export default function Mistakes(){const[m,setM]=useState<MistakeStats>({});useEffect(()=>setM(storage.getMistakes()),[]);const entries=Object.entries(m).sort((a,b)=>b[1].count-a[1].count);return <div className="container section"><div className="sectionHead"><div><div className="eyebrow">Local cache</div><h1>Xato qilingan mavzular</h1></div>{entries.length>0&&<button className="btn" onClick={()=>{storage.clearMistakes();setM({});}}>Barchasini tozalash</button>}</div>{entries.length===0?<div className="empty">Hozircha xatolar saqlanmagan. Sinov yoki mavzu mashqlarini ishlang.</div>:<div className="mistakeGrid">{entries.map(([slug,s])=>{const u=data.units.find(x=>x.slug===slug);return <div className="mistakeCard" key={slug}><div><span>{s.count} xato</span><h3>{u?.title||slug}</h3><p>Oxirgi xato: {new Date(s.lastSeen).toLocaleString()}</p></div><div className="cardActions"><Link className="btn primary" href={`/topic/${slug}`}>Mavzuni o‘rganish</Link><button className="btn" onClick={()=>{storage.clearMistakes(slug);setM(storage.getMistakes());}}>Tozalash</button></div></div>})}</div>}</div>}
