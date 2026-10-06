import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import unitData from '../unit.json';
import type { GeneratedQuestion, UnitFile } from '../types';
import { buildExam, loadAllQuestions } from '../lib/questions';
import { storage } from '../lib/storage';
import { sendTelegramReport } from '../lib/telegram';
import AiTutorActions from '../components/AiTutorActions';

const data=unitData as UnitFile;
type Phase='setup'|'loading'|'exam'|'result';

export default function Practice(){
  const [phase,setPhase]=useState<Phase>('setup');
  const [minutes,setMinutes]=useState(90);
  const [count,setCount]=useState(30);
  const [qs,setQs]=useState<GeneratedQuestion[]>([]);
  const [index,setIndex]=useState(0);
  const [choice,setChoice]=useState<number|null>(null);
  const [score,setScore]=useState(0);
  const [remaining,setRemaining]=useState(0);
  const [wrong,setWrong]=useState<Record<string,number>>({});
  const [assisted,setAssisted]=useState<Record<string,boolean>>({});
  const [telegramStatus,setTelegramStatus]=useState('');
  const startedAt=useRef(0);

  const q=qs[index];
  const maxScore=useMemo(()=>qs.reduce((s,x)=>s+x.points,0),[qs]);
  const assistedCount=Object.keys(assisted).length;

  const start=async()=>{
    setPhase('loading');
    const all=await loadAllQuestions(data.units);
    const exam=buildExam(all,count);
    setQs(exam);
    setIndex(0);
    setScore(0);
    setWrong({});
    setAssisted({});
    setChoice(null);
    setTelegramStatus('');
    setRemaining(minutes*60);
    startedAt.current=Date.now();
    setPhase('exam');
  };

  const finish=async(
    currentScore=score,
    currentWrong=wrong,
    currentAssisted=assisted
  )=>{
    if(phase==='result') return;
    setPhase('result');
    const elapsed=Math.max(0,Math.round((Date.now()-startedAt.current)/1000));
    const pct=maxScore?Math.round(currentScore/maxScore*100):0;
    const name=storage.getName()||'O‘quvchi';
    const wrongUnits=Object.keys(currentWrong).sort((a,b)=>currentWrong[b]-currentWrong[a]);
    const helpCount=Object.keys(currentAssisted).length;

    storage.addHistory({
      id:String(Date.now()),
      name,
      finishedAt:new Date().toISOString(),
      score:currentScore,
      maxScore,
      percent:pct,
      questionCount:qs.length,
      configuredMinutes:minutes,
      elapsedSeconds:elapsed,
      wrongUnits,
      assistedCount:helpCount
    });

    const labels=wrongUnits.map(s=>data.units.find(u=>u.slug===s)?.title||s);
    const msg=`🏁 Informatika sinovi tugadi
Ism: ${name}
Natija: ${currentScore.toFixed(1)} / ${maxScore.toFixed(1)} (${pct}%)
Savollar: ${qs.length}
Vaqt: ${Math.floor(elapsed/60)}m ${elapsed%60}s
AI yordam ishlatilgan savollar: ${helpCount}
Xato mavzular: ${labels.length?labels.join(', '):'yo‘q'}`;

    const r=await sendTelegramReport(msg);
    setTelegramStatus(r.sent?'Admin Telegram botiga xabar yuborildi.':`Telegram: ${r.reason||'yuborilmadi'}`);
  };

  useEffect(()=>{
    if(phase!=='exam') return;
    const t=setInterval(()=>setRemaining(x=>{
      if(x<=1){
        clearInterval(t);
        finish(score,wrong,assisted);
        return 0;
      }
      return x-1;
    }),1000);
    return()=>clearInterval(t);
  },[phase,score,wrong,assisted,maxScore]);

  const answer=(i:number)=>{
    if(choice!==null||!q) return;
    setChoice(i);
    const ok=i===q.answer;
    if(ok) setScore(s=>s+q.points);
    else{
      storage.addMistake(q.unit,q.id);
      setWrong(w=>({...w,[q.unit]:(w[q.unit]||0)+1}));
    }
  };

  const markAiUse=()=>{
    if(!q) return;
    setAssisted(prev=>prev[q.id]?prev:{...prev,[q.id]:true});
  };

  const next=()=>{
    if(index>=qs.length-1){
      finish(score,wrong,assisted);
      return;
    }
    setIndex(i=>i+1);
    setChoice(null);
  };

  if(phase==='setup'||phase==='loading') return <div className="container section narrow">
    <div className="eyebrow">Shaxsiy sinov</div>
    <h1>Vaqt va savollarni o‘zingiz belgilang</h1>
    <p className="lead">30 ta savol tanlasangiz, tizim 10 ta 0.9 ballik, 10 ta 1.5 ballik va 10 ta 2.6 ballik savolga yaqin taqsimlaydi. Bu original 50 ballik tuzilmani takrorlaydi.</p>
    <div className="setupCard">
      <label>Vaqt (daqiqa)<input type="number" min={5} max={240} value={minutes} onChange={e=>setMinutes(Math.max(5,Number(e.target.value)||5))}/></label>
      <label>Savollar soni<select value={count} onChange={e=>setCount(Number(e.target.value))}><option value={15}>15</option><option value={30}>30 (tavsiya)</option><option value={45}>45</option><option value={60}>60</option></select></label>
      <div className="aiExamNote"><b>AI Tutor mavjud.</b> Tushunmay qolsangiz hint olishingiz mumkin. Natijada AI yordam ishlatilgan savollar soni alohida ko‘rsatiladi.</div>
      <button disabled={phase==='loading'} onClick={start} className="btn primary full">{phase==='loading'?'Savollar tayyorlanmoqda…':'Sinovni boshlash'}</button>
    </div>
  </div>;

  if(phase==='result') {
    const pct=maxScore?Math.round(score/maxScore*100):0;
    const weak=Object.entries(wrong).sort((a,b)=>b[1]-a[1]);
    return <div className="container section narrow">
      <div className="resultCard">
        <div className="eyebrow">Natija</div>
        <div className="bigScore">{score.toFixed(1)} <small>/ {maxScore.toFixed(1)}</small></div>
        <h1>{pct}%</h1>
        <p>{pct>=80?'Kuchli natija. Endi xato mavzularni mustahkamlang.':pct>=60?'Yaxshi yo‘ldasiz. Xato mavzularni qayta ko‘rib chiqing.':'Avval xato mavzularni o‘rganib, keyin sinovni qayta ishlang.'}</p>

        <div className="resultMeta">
          <div><span>Savollar</span><b>{qs.length}</b></div>
          <div><span>AI yordam</span><b>{assistedCount}</b></div>
          <div><span>Mustaqil</span><b>{Math.max(0,qs.length-assistedCount)}</b></div>
        </div>

        {weak.length>0&&<div className="weakList">
          <h3>O‘rganish kerak bo‘lgan mavzular</h3>
          {weak.map(([slug,c])=>{
            const u=data.units.find(x=>x.slug===slug);
            return <Link href={`/topic/${slug}`} key={slug}><span>{u?.title||slug}</span><b>{c} xato →</b></Link>;
          })}
        </div>}

        <div className="telegramStatus">{telegramStatus}</div>
        <button className="btn primary" onClick={()=>setPhase('setup')}>Yana sinov</button>
      </div>
    </div>;
  }

  const mm=String(Math.floor(remaining/60)).padStart(2,'0');
  const ss=String(remaining%60).padStart(2,'0');
  const topicTitle=q ? (data.units.find(u=>u.slug===q.unit)?.title||q.unit) : '';

  return <div className="container examPage">
    <div className="examTop">
      <div><span>Savol</span><b>{index+1}/{qs.length}</b></div>
      <div><span>Ball</span><b>{score.toFixed(1)}</b></div>
      <div className="timer"><span>Vaqt</span><b>{mm}:{ss}</b></div>
    </div>
    <div className="progress"><i style={{width:`${(index+1)/qs.length*100}%`}}/></div>

    {q&&<div className="examQuestion">
      <div className="questionMeta"><span className={`badge ${q.difficulty}`}>{q.points} ball</span><span>{topicTitle}</span></div>
      <h2>{q.prompt}</h2>
      <div className="options">
        {q.options.map((o,i)=>{
          const answered=choice!==null;
          const cls=answered?(i===q.answer?'option correct':i===choice?'option wrong':'option'):'option';
          return <button key={i} onClick={()=>answer(i)} disabled={answered} className={cls}><b>{String.fromCharCode(65+i)}</b><span>{o}</span></button>;
        })}
      </div>

      <AiTutorActions
        key={q.id}
        question={q}
        topicTitle={topicTitle}
        userChoice={choice}
        onUse={markAiUse}
      />

      {choice!==null&&<div className={`feedback ${choice===q.answer?'ok':'bad'}`}>
        <b>{choice===q.answer?'To‘g‘ri!':'Xato.'}</b> {q.explanation}
      </div>}

      <button className="btn primary full" disabled={choice===null} onClick={next}>{index===qs.length-1?'Sinovni yakunlash':'Keyingi savol'}</button>
    </div>}
  </div>;
}
