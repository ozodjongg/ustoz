import type { Topic } from '../types';
import { pointsLabel } from '../lib/topics';
import SolutionSteps from './SolutionSteps';

export const lessonAnchors = (t: Topic) => [
  ...t.lesson.sections.map((s, i) => ({ id: `bolim-${i + 1}`, title: s.title })),
  { id: 'misollar', title: 'Ishlangan misollar' },
  { id: 'xatolar', title: 'Ko‘p uchraydigan xatolar' },
  { id: 'eslab-qol', title: 'Eslab qol' },
  { id: 'lugat', title: 'Lug‘at' },
  { id: 'olimpiadada', title: 'Olimpiadada qayerda uchragan?' },
];

export default function LessonView({ topic }: { topic: Topic }) {
  const { lesson } = topic;
  const YEARS: Array<{ year: number; label: string }> = [{ year: 2025, label: '2025–2026 o‘quv yili' }, { year: 2024, label: '2024-yil' }];
  const groups = YEARS.flatMap(({ year, label }) => [9, 10, 11].map(g => ({
    key: `${year}-${g}`, label, g, items: topic.sources.filter(s => s.year === year && s.grade === g)
  }))).filter(x => x.items.length);

  return <article className="lesson">
    <section className="hook">
      <div className="hookIcon" aria-hidden="true">{topic.icon}</div>
      <div>
        <div className="eyebrow">Keling, oddiydan boshlaymiz</div>
        <h2>{lesson.hook.title}</h2>
        <p>{lesson.hook.text}</p>
      </div>
    </section>

    {lesson.sections.map((s, i) => <section key={s.title} id={`bolim-${i + 1}`} className="lessonSection">
      <h2>{s.title}</h2>
      {s.text?.map((p, j) => <p key={j}>{p}</p>)}
      {s.table && <div className="tableWrap"><table>
        <thead><tr>{s.table.head.map(h => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{s.table.rows.map((r, k) => <tr key={k}>{r.map((c, m) => <td key={m}>{c}</td>)}</tr>)}</tbody>
      </table></div>}
      {s.code && <pre className="codeBlock"><code>{s.code}</code></pre>}
      {s.note && <p className="note">{s.note}</p>}
    </section>)}

    <section id="misollar" className="lessonSection">
      <h2>Ishlangan misollar</h2>
      <div className="exampleGrid">
        {lesson.examples.map(ex => <div className="exampleCard" key={ex.title}>
          <h3>{ex.title}</h3>
          <SolutionSteps steps={ex.steps} />
          <div className="exampleAnswer"><span>Javob</span><b>{ex.answer}</b></div>
        </div>)}
      </div>
    </section>

    <section id="xatolar" className="lessonSection">
      <h2>Ko‘p uchraydigan xatolar</h2>
      <ul className="pitfalls">{lesson.pitfalls.map(p => <li key={p}>{p}</li>)}</ul>
    </section>

    <section id="eslab-qol" className="lessonSection remember">
      <h2>Eslab qol</h2>
      <ul>{lesson.remember.map(p => <li key={p}>{p}</li>)}</ul>
    </section>

    <section id="lugat" className="lessonSection">
      <h2>Lug‘at</h2>
      <dl className="glossary">{lesson.glossary.map(g => <div key={g.term}><dt>{g.term}</dt><dd>{g.meaning}</dd></div>)}</dl>
    </section>

    <section id="olimpiadada" className="lessonSection">
      <h2>Olimpiadada qayerda uchragan?</h2>
      <p className="muted">Tuman (shahar) bosqichi savollaridan shu mavzuga tegishlilari:</p>
      <div className="sourceGrid">
        {groups.map(({ key, label, g, items }) => <div className="sourceGroup" key={key}>
          <b>{label} · {g}-sinf</b>
          {items.map(s => <div className="sourceRow" key={s.number}><span>№{s.number} · {pointsLabel(s.points)}</span><p>{s.text}</p></div>)}
        </div>)}
      </div>
    </section>
  </article>;
}
