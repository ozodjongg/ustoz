import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { storage } from '../lib/storage';
import { data, topics, topicTitle } from '../lib/topics';
import type { MistakeStats, ProgressMap } from '../types';

const totalQuestions = topics.reduce((s, t) => s + t.question_count, 0);

export default function Home() {
  const [mistakes, setMistakes] = useState<MistakeStats>({});
  const [progress, setProgress] = useState<ProgressMap>({});
  useEffect(() => { setMistakes(storage.getMistakes()); setProgress(storage.getProgress()); }, []);

  const weak = useMemo(() => Object.entries(mistakes).sort((a, b) => b[1].count - a[1].count).slice(0, 4), [mistakes]);
  const stat = (slug: string) => {
    const ids = Object.keys(progress).filter(k => k.startsWith(`${slug}-`));
    return { done: ids.length, ok: ids.filter(k => progress[k]).length };
  };
  const doneAll = Object.keys(progress).length;

  return <>
    <Head><title>Informatika olimpiada — mavzular va mashqlar</title></Head>

    <section className="hero">
      <div className="container heroGrid">
        <div>
          <div className="eyebrow">9–11-sinf · tuman (shahar) bosqichi</div>
          <h1>Informatika olimpiadasiga <span className="accentText">sokin va puxta</span> tayyorlaning</h1>
          <p className="lead">2024-yilgi olimpiadaning 90 ta savoli tahlil qilinib, {topics.length} ta mavzuga ajratildi. Har bir mavzuda bolalarcha sodda dars va qadam-baqadam yechimli 50 ta turli savol bor.</p>
          <div className="row">
            <a href="#mavzular" className="btn primary">Mavzularni ko‘rish</a>
            <Link href="/practice" className="btn">Sinov ishlash</Link>
          </div>
        </div>
        <div className="statCard">
          <div><span>Mavzular</span><strong>{topics.length}</strong></div>
          <div><span>Yechimli savollar</span><strong>{totalQuestions}</strong></div>
          <div><span>Sinov formati</span><strong>30 savol · {data.scoring.max_score} ball</strong></div>
          <div><span>Siz yechgansiz</span><strong>{doneAll} / {totalQuestions}</strong></div>
          <small>Ball tizimi: 1–10 savollar {String(data.scoring.easy).replace('.', ',')}, 11–20 — {String(data.scoring.medium).replace('.', ',')}, 21–30 — {String(data.scoring.hard).replace('.', ',')} ball.</small>
        </div>
      </div>
    </section>

    <section className="container section">
      {weak.length > 0 && <div className="weakPanel">
        <div>
          <div className="eyebrow">Takrorlash kerak</div>
          <h2>Ko‘proq xato qilingan mavzular</h2>
        </div>
        <div className="weakLinks">
          {weak.map(([slug, s]) => <Link key={slug} href={`/topic/${slug}/mashq?xato=1`}>{topicTitle(slug)}<span>{s.questionIds.length} ta savolni qayta ishlash →</span></Link>)}
        </div>
      </div>}

      <div id="mavzular" className="sectionHead">
        <div>
          <div className="eyebrow">Olimpiada xaritasi</div>
          <h2>{topics.length} ta mavzu</h2>
        </div>
        <p className="muted">Avval darsni o‘qing, so‘ng 50 ta mashqni ishlang. Tushunmagan savolingizda «Qadam-baqadam yechim» va AI yordamchi bor.</p>
      </div>

      <div className="topicGrid">
        {topics.map(t => {
          const s = stat(t.slug);
          const pct = Math.round(s.done / t.question_count * 100);
          return <Link href={`/topic/${t.slug}`} className="topicCard" key={t.slug}>
            <div className="topicTop"><span className="topicIcon" aria-hidden="true">{t.icon}</span><span className="topicNum">{String(t.order).padStart(2, '0')}</span></div>
            <h3>{t.title}</h3>
            <p>{t.short}</p>
            <div className="topicFoot">
              <div className="miniProgress" aria-label={`${s.done} / ${t.question_count} yechilgan`}><i style={{ width: `${pct}%` }} /></div>
              <span>{s.done ? `${s.done}/${t.question_count} · ${s.ok} to‘g‘ri` : `${t.sources.length} ta olimpiada savoli · ${t.question_count} mashq`}</span>
            </div>
          </Link>;
        })}
      </div>
    </section>
  </>;
}
