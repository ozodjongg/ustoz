import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import QuestionCard from '../../../components/QuestionCard';
import { loadUnitQuestions, shuffle } from '../../../lib/questions';
import { storage } from '../../../lib/storage';
import { topics, topicBySlug } from '../../../lib/topics';
import type { ProgressMap, Question, Topic } from '../../../types';

type Filter = 'all' | 'easy' | 'medium' | 'hard' | 'todo' | 'wrong';

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: 'Hammasi' },
  { key: 'easy', label: '0,9 ball' },
  { key: 'medium', label: '1,5 ball' },
  { key: 'hard', label: '2,6 ball' },
  { key: 'todo', label: 'Yechilmagan' },
  { key: 'wrong', label: 'Xatolarim' },
];

export default function TopicPractice({ topic }: { topic: Topic }) {
  const router = useRouter();
  const [all, setAll] = useState<Question[]>([]);
  const [error, setError] = useState('');
  // progress — jonli natijalar (statistika, rangli tugmalar); snapshot — filtr uchun,
  // javob berilganda joriy savol ro‘yxatdan darhol yo‘qolib qolmasligi uchun faqat o‘tishda yangilanadi.
  const [progress, setProgress] = useState<ProgressMap>({});
  const [snapshot, setSnapshot] = useState<ProgressMap>({});
  const [filter, setFilter] = useState<Filter>('all');
  const [order, setOrder] = useState<string[] | null>(null);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const p = storage.getProgress();
    setProgress(p);
    setSnapshot(p);
    loadUnitQuestions(topic.slug).then(setAll).catch(() => setError('Savollarni yuklab bo‘lmadi. Sahifani yangilang.'));
  }, [topic.slug]);

  useEffect(() => {
    if (router.isReady && router.query.xato === '1') setFilter('wrong');
  }, [router.isReady, router.query.xato]);

  const visible = useMemo(() => {
    const base = order ? order.map(id => all.find(q => q.id === id)!).filter(Boolean) : all;
    return base.filter(q => {
      if (filter === 'all') return true;
      if (filter === 'todo') return snapshot[q.id] === undefined;
      if (filter === 'wrong') return snapshot[q.id] === false;
      return q.difficulty === filter;
    });
  }, [all, order, filter, snapshot]);

  // Filtr o‘zgarsa, joriy savol ro‘yxatda bo‘lmasa — birinchisiga o‘tamiz.
  useEffect(() => {
    if (!visible.length) return;
    if (!current || !visible.some(q => q.id === current)) setCurrent(visible[0].id);
  }, [visible, current]);

  const idx = visible.findIndex(q => q.id === current);
  const q = idx >= 0 ? visible[idx] : undefined;
  const done = all.filter(x => progress[x.id] !== undefined).length;
  const ok = all.filter(x => progress[x.id] === true).length;

  const onAnswered = (question: Question, correct: boolean) => {
    storage.setProgress(question.id, correct);
    if (correct) storage.resolveMistake(topic.slug, question.id);
    else storage.addMistake(topic.slug, question.id);
    setProgress(storage.getProgress());
  };

  const go = (delta: number) => {
    setSnapshot(storage.getProgress());
    const next = visible[idx + delta];
    if (next) setCurrent(next.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pick = (id: string) => { setSnapshot(storage.getProgress()); setCurrent(id); };

  const reset = () => {
    if (!window.confirm('Bu mavzudagi barcha natijalar o‘chirilsinmi?')) return;
    storage.clearProgress(`${topic.slug}-`);
    storage.clearMistakes(topic.slug);
    const p = storage.getProgress();
    setProgress(p);
    setSnapshot(p);
    setFilter('all');
  };

  const navState = (id: string) => progress[id] === true ? 'ok' : progress[id] === false ? 'bad' : '';

  return <div className="container section practicePage">
    <Head><title>{`${topic.title} — mashq`}</title></Head>
    <nav className="breadcrumbs" aria-label="Yo‘l"><Link href="/">Mavzular</Link><span>/</span><Link href={`/topic/${topic.slug}`}>{topic.title}</Link><span>/</span><span>Mashq</span></nav>

    <header className="practiceHead">
      <div>
        <div className="eyebrow">Mashq · {topic.question_count} ta savol</div>
        <h1>{topic.title}</h1>
      </div>
      <div className="practiceStats">
        <div><b>{done}</b><span>yechilgan</span></div>
        <div><b>{ok}</b><span>to‘g‘ri</span></div>
        <div><b>{done - ok}</b><span>xato</span></div>
      </div>
    </header>

    <div className="filterRow">
      <div className="segmented" role="tablist">
        {FILTERS.map(f => <button key={f.key} type="button" role="tab" aria-selected={filter === f.key} className={filter === f.key ? 'on' : ''} onClick={() => { setSnapshot(storage.getProgress()); setFilter(f.key); }}>{f.label}</button>)}
      </div>
      <div className="row tight">
        <button type="button" className="btn small ghost" onClick={() => { setOrder(order ? null : shuffle(all.map(x => x.id))); }}>{order ? 'Tartib bo‘yicha' : 'Aralashtirish'}</button>
        <button type="button" className="btn small ghost" onClick={reset}>Natijalarni tozalash</button>
      </div>
    </div>

    {error && <div className="empty">{error}</div>}
    {!error && all.length === 0 && <div className="empty">Savollar yuklanmoqda…</div>}
    {all.length > 0 && visible.length === 0 && <div className="empty">
      {filter === 'wrong' ? 'Bu mavzuda xato qilingan savol qolmadi. Barakalla!' : filter === 'todo' ? 'Barcha savollar yechilgan. Ajoyib!' : 'Savol topilmadi.'}
      <div className="row center"><button className="btn" onClick={() => setFilter('all')}>Barcha savollar</button></div>
    </div>}

    {q && <div className="practiceLayout">
      <div>
        <QuestionCard key={q.id} question={q} topicTitle={topic.title} label={`${idx + 1} / ${visible.length}`} onAnswered={(c) => onAnswered(q, c)}>
          <div className="cardNav">
            <button type="button" className="btn" disabled={idx <= 0} onClick={() => go(-1)}>← Oldingi</button>
            {idx < visible.length - 1
              ? <button type="button" className="btn primary" onClick={() => go(1)}>Keyingi savol →</button>
              : <Link href={`/topic/${topic.slug}`} className="btn primary">Darsga qaytish</Link>}
          </div>
        </QuestionCard>
      </div>
      <aside className="qNavWrap">
        <div className="qNavCard">
          <div className="eyebrow">Savollar</div>
          <div className="qNav">
            {visible.map((x, i) => <button key={x.id} type="button" className={`${navState(x.id)} ${x.id === q.id ? 'cur' : ''}`} onClick={() => pick(x.id)} aria-label={`${i + 1}-savol`}>{i + 1}</button>)}
          </div>
          <div className="legend"><span><i className="ok" />to‘g‘ri</span><span><i className="bad" />xato</span><span><i />yechilmagan</span></div>
          <Link href={`/topic/${topic.slug}`} className="btn ghost full">Darsni qayta o‘qish</Link>
        </div>
      </aside>
    </div>}
  </div>;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: topics.map(t => ({ params: { slug: t.slug } })),
  fallback: false
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const topic = topicBySlug(String(params?.slug));
  return topic ? { props: { topic } } : { notFound: true };
};
