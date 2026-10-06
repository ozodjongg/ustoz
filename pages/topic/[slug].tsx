import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import unitData from '../../unit.json';
import { loadUnitQuestions } from '../../lib/questions';
import { storage } from '../../lib/storage';
import QuestionCard from '../../components/QuestionCard';
import type { GeneratedQuestion, Unit, UnitFile } from '../../types';

export default function TopicPage({ unit }: { unit: Unit }) {
  const [questions,setQuestions]=useState<GeneratedQuestion[]>([]);
  const [idx,setIdx]=useState(0);
  useEffect(()=>{loadUnitQuestions(unit.slug).then(q=>{setQuestions(q.sort(()=>Math.random()-.5));setIdx(0);});},[unit.slug]);
  const q=questions[idx];
  const sourceByGrade=useMemo(()=>[9,10,11].map(g=>({g,items:unit.source_questions.filter(x=>x.grade===g)})),[unit]);
  const next=()=>setIdx(x=>(x+1)%Math.max(1,questions.length));

  return <div className="container section topicPage">
    <div className="breadcrumbs"><Link href="/">Bosh sahifa</Link><span>/</span><span>{unit.title}</span></div>
    <div className="topicHero">
      <div><div className="eyebrow">Mavzu darsi</div><h1>{unit.title}</h1><p>{unit.short}</p></div>
      <div className="miniStat"><b>100</b><span>mashq</span></div>
    </div>

    <div className="aiLessonCallout">
      <div className="aiSpark">AI</div>
      <div>
        <b>Biror joyi tushunarsiz bo‘lsa, savol yonidagi AI Tutor’dan foydalaning.</b>
        <p>Hint javobni ochmaydi. “Tushuntir” sizning xatongizni tahlil qiladi. “Chuqur o‘rgan” esa AIni mikro-dars va ketma-ket mashqlar beradigan repetitor rejimiga o‘tkazadi.</p>
      </div>
    </div>

    <div className="lessonGrid">
      <article className="lesson">
        <section className="story"><h2>Eng sodda tushuntirish</h2><p>{unit.lesson.intro}</p></section>
        <section><h2>Asosiy qoidalar</h2><ul>{unit.lesson.keyIdeas.map(x=><li key={x}>{x}</li>)}</ul></section>
        <section><h2>Masalani qanday yechamiz?</h2><ol>{unit.lesson.steps.map(x=><li key={x}>{x}</li>)}</ol></section>
        <section className="twoCols"><div><h2>Misollar</h2><ul>{unit.lesson.examples.map(x=><li key={x}>{x}</li>)}</ul></div><div><h2>Ko‘p uchraydigan xatolar</h2><ul>{unit.lesson.pitfalls.map(x=><li key={x}>{x}</li>)}</ul></div></section>
        <section className="tipBox"><h2>Olimpiada uchun eslab qol</h2><ul>{unit.lesson.tips.map(x=><li key={x}>{x}</li>)}</ul></section>
        <section><h2>2025 testida qayerda uchragan?</h2>{sourceByGrade.map(({g,items})=>items.length?<div className="sourceGroup" key={g}><b>{g}-sinf</b>{items.map(s=><div className="sourceRow" key={s.question}><span>#{s.question} · {s.points} ball · javob {s.answer}</span><p>{s.summary}</p></div>)}</div>:null)}</section>
      </article>

      <aside className="practiceAside">
        <div className="sticky">
          <div className="eyebrow">Tasodifiy mashq</div>
          {q
            ? <>
                <QuestionCard
                  key={q.id}
                  question={q}
                  topicTitle={unit.title}
                  onAnswered={(correct)=>{if(!correct) storage.addMistake(unit.slug,q.id)}}
                />
                <button className="btn primary full" onClick={next}>Keyingi savol</button>
              </>
            : <div className="loading">Savol yuklanmoqda…</div>
          }
        </div>
      </aside>
    </div>
  </div>;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths:(unitData as UnitFile).units.map(u=>({params:{slug:u.slug}})),
  fallback:false
});

export const getStaticProps: GetStaticProps = async ({params}) => {
  const unit=(unitData as UnitFile).units.find(u=>u.slug===params?.slug);
  return unit ? {props:{unit}} : {notFound:true};
};
