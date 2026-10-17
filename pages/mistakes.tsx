import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { topicBySlug } from '../lib/topics';
import type { ExamHistory, MistakeStats } from '../types';

export default function Mistakes() {
  const [m, setM] = useState<MistakeStats>({});
  const [history, setHistory] = useState<ExamHistory[]>([]);
  useEffect(() => { setM(storage.getMistakes()); setHistory(storage.getHistory()); }, []);
  const entries = Object.entries(m).filter(([slug]) => topicBySlug(slug)).sort((a, b) => b[1].questionIds.length - a[1].questionIds.length);

  return <div className="container section">
    <Head><title>Xatolar — Informatika olimpiada</title></Head>
    <div className="sectionHead">
      <div>
        <div className="eyebrow">Shaxsiy tahlil</div>
        <h1>Xatolar ustida ishlash</h1>
        <p className="muted">Xato qilingan savollar shu yerda yig‘iladi. Ularni qayta to‘g‘ri yechsangiz — ro‘yxatdan o‘chadi.</p>
      </div>
      {entries.length > 0 && <button className="btn ghost" onClick={() => { if (window.confirm('Barcha xatolar tozalansinmi?')) { storage.clearMistakes(); setM({}); } }}>Barchasini tozalash</button>}
    </div>

    {entries.length === 0
      ? <div className="empty">Hozircha xato qilingan savollar yo‘q. Mavzu mashqlari yoki sinovni ishlang.<div className="row center"><Link href="/" className="btn primary">Mavzularga o‘tish</Link></div></div>
      : <div className="mistakeGrid">{entries.map(([slug, s]) => {
        const t = topicBySlug(slug)!;
        return <div className="mistakeCard" key={slug}>
          <div className="mistakeTop"><span className="topicIcon" aria-hidden="true">{t.icon}</span><span className="badgeBad">{s.questionIds.length} ta savol</span></div>
          <h3>{t.title}</h3>
          <p className="fine">Oxirgi xato: {new Date(s.lastSeen).toLocaleString('uz-UZ')}</p>
          <div className="row tight">
            <Link className="btn primary small" href={`/topic/${slug}/mashq?xato=1`}>Xatolarni qayta ishlash</Link>
            <Link className="btn small" href={`/topic/${slug}`}>Darsni o‘qish</Link>
          </div>
        </div>;
      })}</div>}

    {history.length > 0 && <section className="historySection">
      <h2>Sinovlar tarixi</h2>
      <div className="tableWrap"><table>
        <thead><tr><th>Sana</th><th>Natija</th><th>Foiz</th><th>Savollar</th><th>Vaqt</th><th>AI yordam</th></tr></thead>
        <tbody>{history.map(h => <tr key={h.id}>
          <td>{new Date(h.finishedAt).toLocaleDateString('uz-UZ')}</td>
          <td>{h.score.toFixed(1).replace('.', ',')} / {h.maxScore.toFixed(1).replace('.', ',')}</td>
          <td>{h.percent}%</td>
          <td>{h.questionCount}</td>
          <td>{Math.floor(h.elapsedSeconds / 60)} daq</td>
          <td>{h.assistedCount ?? 0}</td>
        </tr>)}</tbody>
      </table></div>
    </section>}
  </div>;
}
