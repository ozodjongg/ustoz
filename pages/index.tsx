import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import unitData from '../unit.json';
import { storage } from '../lib/storage';
import type { MistakeStats, UnitFile } from '../types';

const data = unitData as UnitFile;
export default function Home(){
  const [mistakes,setMistakes]=useState<MistakeStats>({});
  useEffect(()=>setMistakes(storage.getMistakes()),[]);
  const weak=useMemo(()=>Object.entries(mistakes).sort((a,b)=>b[1].count-a[1].count).slice(0,5),[mistakes]);
  return <>
    <section className="hero"><div className="container heroGrid">
      <div><div className="eyebrow">Shahar olimpiadasiga tayyorgarlik</div><h1>17 mavzu. 1700 ta mashq. Savolni tushunmasangiz — AI Tutor.</h1><p>9-, 10- va 11-sinf 2025-yil testlaridagi 90 savol mavzulari birlashtirildi. Rasmiy ball tizimi: 0.9 / 1.5 / 2.6. Har savolda hint, batafsil tushuntirish yoki chuqur AI-repetitor prompti tayyorlanadi.</p><div className="heroActions"><Link href="/practice" className="btn primary">Sinovni boshlash</Link><a href="#mavzular" className="btn">Mavzularni o‘rganish</a></div></div>
      <div className="scoreCard"><div><span>Standart vaqt</span><strong>90 daqiqa</strong></div><div><span>Savollar</span><strong>30 ta</strong></div><div><span>Maksimal ball</span><strong>50</strong></div><small>Sinov vaqtini va savollar sonini o‘zingiz tanlashingiz mumkin.</small></div>
    </div></section>
    <section className="container section">
      {weak.length>0 && <div className="weakPanel"><div><div className="eyebrow">Sizga kerak bo‘lgan mavzular</div><h2>Xato ko‘p bo‘lgan mavzular</h2></div><div className="weakLinks">{weak.map(([slug,s])=>{const u=data.units.find(x=>x.slug===slug);return u?<Link key={slug} href={`/topic/${slug}`}>{u.title}<span>{s.count} xato</span></Link>:null;})}</div></div>}
      <div id="mavzular" className="sectionHead"><div><div className="eyebrow">Mavzular</div><h2>Olimpiada xaritasi</h2></div><p>Har bir mavzuda sodda tushuntirish va 100 ta tasodifiy mashq bor.</p></div>
      <div className="topicGrid">{data.units.map((u,idx)=><Link href={`/topic/${u.slug}`} className="topicCard" key={u.slug}><div className="topicNum">{String(idx+1).padStart(2,'0')}</div><h3>{u.title}</h3><p>{u.short}</p><div className="topicFoot"><span>{u.source_questions.length} ta original savol</span><span>100 ta mashq →</span></div></Link>)}</div>
    </section>
  </>;
}
