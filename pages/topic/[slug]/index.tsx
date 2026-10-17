import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LessonView, { lessonAnchors } from '../../../components/LessonView';
import { storage } from '../../../lib/storage';
import { topics, topicBySlug } from '../../../lib/topics';
import type { Topic } from '../../../types';

export default function TopicPage({ topic }: { topic: Topic }) {
  const [done, setDone] = useState(0);
  const [ok, setOk] = useState(0);
  useEffect(() => {
    const p = storage.getProgress();
    const ids = Object.keys(p).filter(k => k.startsWith(`${topic.slug}-`));
    setDone(ids.length);
    setOk(ids.filter(k => p[k]).length);
  }, [topic.slug]);

  const idx = topics.findIndex(t => t.slug === topic.slug);
  const prev = topics[idx - 1];
  const next = topics[idx + 1];

  return <div className="container section">
    <Head><title>{`${topic.title} — dars`}</title></Head>
    <nav className="breadcrumbs" aria-label="Yo‘l"><Link href="/">Mavzular</Link><span>/</span><span>{topic.title}</span></nav>

    <header className="topicHero">
      <div>
        <div className="eyebrow">Mavzu {topic.order} · dars</div>
        <h1>{topic.title}</h1>
        <p className="lead">{topic.short}</p>
      </div>
      <div className="practiceCta">
        <div className="ctaNums"><b>{topic.question_count}</b><span>yechimli savol</span></div>
        {done > 0 && <div className="ctaProgress"><div className="miniProgress"><i style={{ width: `${done / topic.question_count * 100}%` }} /></div><small>{done} ta yechilgan · {ok} ta to‘g‘ri</small></div>}
        <Link href={`/topic/${topic.slug}/mashq`} className="btn primary full">{done > 0 ? 'Mashqni davom ettirish' : 'Mashqni boshlash'}</Link>
      </div>
    </header>

    <div className="lessonLayout">
      <aside className="toc" aria-label="Mundarija">
        <div className="tocInner">
          <div className="eyebrow">Mundarija</div>
          {lessonAnchors(topic).map(a => <a key={a.id} href={`#${a.id}`}>{a.title}</a>)}
        </div>
      </aside>
      <div>
        <LessonView topic={topic} />
        <div className="lessonEnd">
          <div>
            <h2>Darsni tugatdingizmi?</h2>
            <p className="muted">Endi bilimingizni 50 ta savolda sinab ko‘ring. Har bir savolning to‘liq yechimi bor.</p>
          </div>
          <Link href={`/topic/${topic.slug}/mashq`} className="btn primary">Mashqqa o‘tish →</Link>
        </div>
        <div className="pager">
          {prev ? <Link href={`/topic/${prev.slug}`} className="pagerLink"><span>← Oldingi mavzu</span><b>{prev.title}</b></Link> : <span />}
          {next ? <Link href={`/topic/${next.slug}`} className="pagerLink right"><span>Keyingi mavzu →</span><b>{next.title}</b></Link> : <span />}
        </div>
      </div>
    </div>
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
