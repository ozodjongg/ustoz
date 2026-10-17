import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import QuestionCard from '../components/QuestionCard';
import SolutionSteps from '../components/SolutionSteps';
import { buildExam, loadAllQuestions } from '../lib/questions';
import { storage } from '../lib/storage';
import { sendTelegramReport } from '../lib/telegram';
import { data, topics, topicTitle } from '../lib/topics';
import type { Question } from '../types';

type Phase = 'setup' | 'loading' | 'exam' | 'result';
type Answer = { choice: number; correct: boolean };

export default function Practice() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [minutes, setMinutes] = useState(data.scoring.default_time_minutes);
  const [count, setCount] = useState(30);
  const [selected, setSelected] = useState<string[]>(topics.map(t => t.slug));
  const [qs, setQs] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [assisted, setAssisted] = useState<Record<string, boolean>>({});
  const [remaining, setRemaining] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [telegramStatus, setTelegramStatus] = useState('');
  const [error, setError] = useState('');
  const startedAt = useRef(0);
  const finished = useRef(false);

  const q = qs[index];
  const maxScore = useMemo(() => qs.reduce((s, x) => s + x.points, 0), [qs]);
  const score = useMemo(() => qs.reduce((s, x) => s + (answers[x.id]?.correct ? x.points : 0), 0), [qs, answers]);
  const wrongQs = qs.filter(x => answers[x.id] && !answers[x.id].correct);
  const skipped = qs.filter(x => !answers[x.id]);

  const toggleTopic = (slug: string) => setSelected(s => s.includes(slug) ? s.filter(x => x !== slug) : [...s, slug]);

  const start = async () => {
    if (!selected.length) return;
    setPhase('loading');
    setError('');
    try {
      const pool = await loadAllQuestions(topics.filter(t => selected.includes(t.slug)));
      setQs(buildExam(pool, count));
    } catch {
      setError('Savollarni yuklab bo‘lmadi. Internetni tekshirib, qayta urinib ko‘ring.');
      setPhase('setup');
      return;
    }
    setIndex(0);
    setAnswers({});
    setAssisted({});
    setTelegramStatus('');
    setRemaining(minutes * 60);
    startedAt.current = Date.now();
    finished.current = false;
    setPhase('exam');
  };

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setElapsed(Math.max(0, Math.round((Date.now() - startedAt.current) / 1000)));
    setPhase('result');
  };

  // Natijani saqlash va Telegram xabari — natija sahifasi ochilganda bir marta.
  useEffect(() => {
    if (phase !== 'result') return;
    const pct = maxScore ? Math.round(score / maxScore * 100) : 0;
    const name = storage.getName() || 'O‘quvchi';
    const wrongCount: Record<string, number> = {};
    qs.forEach(x => { if (!answers[x.id]?.correct) wrongCount[x.unit] = (wrongCount[x.unit] || 0) + 1; });
    const wrongUnits = Object.keys(wrongCount).sort((a, b) => wrongCount[b] - wrongCount[a]);
    const helpCount = Object.keys(assisted).length;
    storage.addHistory({
      id: String(Date.now()), name, finishedAt: new Date().toISOString(), score, maxScore, percent: pct,
      questionCount: qs.length, configuredMinutes: minutes, elapsedSeconds: elapsed, wrongUnits, assistedCount: helpCount
    });
    const msg = `🏁 Informatika sinovi tugadi
Ism: ${name}
Natija: ${score.toFixed(1)} / ${maxScore.toFixed(1)} (${pct}%)
Savollar: ${qs.length}
Vaqt: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s
AI yordam ishlatilgan savollar: ${helpCount}
Xato mavzular: ${wrongUnits.length ? wrongUnits.map(topicTitle).join(', ') : 'yo‘q'}`;
    sendTelegramReport(msg).then(r => setTelegramStatus(r.sent ? 'Natija admin Telegram botiga yuborildi.' : r.reason === 'Telegram o‘chirilgan' ? '' : `Telegram: ${r.reason || 'yuborilmadi'}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== 'exam') return;
    const t = setInterval(() => setRemaining(x => x - 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => { if (phase === 'exam' && remaining <= 0) finish(); }, [remaining, phase]);

  const answer = (question: Question, correct: boolean, choice: number) => {
    setAnswers(a => ({ ...a, [question.id]: { choice, correct } }));
    storage.setProgress(question.id, correct);
    if (correct) storage.resolveMistake(question.unit, question.id);
    else storage.addMistake(question.unit, question.id);
  };

  const next = () => {
    if (index >= qs.length - 1) finish();
    else { setIndex(i => i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  if (phase === 'setup' || phase === 'loading') return <div className="container section narrow">
    <Head><title>Sinov — Informatika olimpiada</title></Head>
    <div className="eyebrow">Olimpiada formatidagi sinov</div>
    <h1>Vaqt, savollar va mavzularni tanlang</h1>
    <p className="lead">30 ta savol tanlansa, xuddi olimpiadadagidek 10 ta 0,9 ballik, 10 ta 1,7 ballik va 10 ta 2,4 ballik savol beriladi — jami 50 ball.</p>
    <div className="panel">
      <div className="formGrid">
        <label>Vaqt (daqiqa)<input type="number" min={5} max={240} value={minutes} onChange={e => setMinutes(Math.min(240, Math.max(5, Number(e.target.value) || 5)))} /></label>
        <label>Savollar soni<select value={count} onChange={e => setCount(Number(e.target.value))}><option value={15}>15</option><option value={30}>30 (olimpiada)</option><option value={45}>45</option><option value={60}>60</option></select></label>
      </div>
      <div className="topicPicker">
        <div className="pickerHead"><b>Mavzular</b>
          <div className="row tight">
            <button type="button" className="linkBtn" onClick={() => setSelected(topics.map(t => t.slug))}>Hammasi</button>
            <button type="button" className="linkBtn" onClick={() => setSelected([])}>Tozalash</button>
          </div>
        </div>
        <div className="pickerGrid">
          {topics.map(t => <label key={t.slug} className={`pick ${selected.includes(t.slug) ? 'on' : ''}`}>
            <input type="checkbox" checked={selected.includes(t.slug)} onChange={() => toggleTopic(t.slug)} />
            <span aria-hidden="true">{t.icon}</span>{t.title}
          </label>)}
        </div>
      </div>
      <p className="note">Tushunmagan savolda AI yordamchidan foydalanishingiz mumkin — natijada bunday savollar soni alohida ko‘rsatiladi.</p>
      {error && <p className="errorText">{error}</p>}
      <button disabled={phase === 'loading' || !selected.length} onClick={start} className="btn primary full">{phase === 'loading' ? 'Savollar tayyorlanmoqda…' : 'Sinovni boshlash'}</button>
    </div>
  </div>;

  if (phase === 'result') {
    const pct = maxScore ? Math.round(score / maxScore * 100) : 0;
    const byUnit: Record<string, number> = {};
    [...wrongQs, ...skipped].forEach(x => { byUnit[x.unit] = (byUnit[x.unit] || 0) + 1; });
    const weak = Object.entries(byUnit).sort((a, b) => b[1] - a[1]);
    return <div className="container section narrow">
      <Head><title>Natija — Informatika olimpiada</title></Head>
      <div className="panel resultCard">
        <div className="eyebrow">Natija</div>
        <div className="bigScore">{score.toFixed(1).replace('.', ',')} <small>/ {maxScore.toFixed(1).replace('.', ',')} ball</small></div>
        <h2>{pct}% · {pct >= 80 ? 'A’lo natija!' : pct >= 60 ? 'Yaxshi, yana ozgina!' : 'Mavzularni takrorlab, yana urinib ko‘ring'}</h2>
        <div className="resultMeta">
          <div><span>To‘g‘ri</span><b>{qs.length - wrongQs.length - skipped.length}</b></div>
          <div><span>Xato</span><b>{wrongQs.length}</b></div>
          <div><span>Javobsiz</span><b>{skipped.length}</b></div>
          <div><span>AI yordam</span><b>{Object.keys(assisted).length}</b></div>
          <div><span>Vaqt</span><b>{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}</b></div>
        </div>
        {weak.length > 0 && <div className="weakList">
          <h3>Takrorlash kerak bo‘lgan mavzular</h3>
          {weak.map(([slug, c]) => <Link href={`/topic/${slug}`} key={slug}><span>{topicTitle(slug)}</span><b>{c} ta →</b></Link>)}
        </div>}
        {telegramStatus && <p className="fine">{telegramStatus}</p>}
        <div className="row"><button className="btn primary" onClick={() => setPhase('setup')}>Yangi sinov</button><Link className="btn" href="/mistakes">Xatolar bo‘limi</Link></div>
      </div>

      {wrongQs.length > 0 && <section className="review">
        <h2>Xato javoblar tahlili</h2>
        {wrongQs.map(x => <details key={x.id} className="reviewItem">
          <summary><span className={`badge ${x.difficulty}`}>{String(x.points).replace('.', ',')}</span><span>{x.prompt}</span></summary>
          {x.code && <pre className="codeBlock"><code>{x.code}</code></pre>}
          <p><b>Sizning javobingiz:</b> {answers[x.id].choice >= 0 ? x.options[answers[x.id].choice] : 'Bilmayman'} · <b>To‘g‘ri javob:</b> {x.options[x.answer]}</p>
          <SolutionSteps steps={x.solution} />
        </details>)}
      </section>}
    </div>;
  }

  const mm = String(Math.max(0, Math.floor(remaining / 60))).padStart(2, '0');
  const ss = String(Math.max(0, remaining % 60)).padStart(2, '0');
  const answered = q ? Boolean(answers[q.id]) : false;

  return <div className="container examPage">
    <Head><title>{`Sinov ${index + 1}/${qs.length}`}</title></Head>
    <div className="examTop">
      <div><span>Savol</span><b>{index + 1}/{qs.length}</b></div>
      <div><span>Ball</span><b>{score.toFixed(1).replace('.', ',')}</b></div>
      <div className={remaining < 60 ? 'timer low' : 'timer'}><span>Vaqt</span><b>{mm}:{ss}</b></div>
      <button type="button" className="btn small ghost" onClick={() => { if (window.confirm('Sinov yakunlansinmi?')) finish(); }}>Yakunlash</button>
    </div>
    <div className="progress"><i style={{ width: `${(index + 1) / qs.length * 100}%` }} /></div>

    {q && <QuestionCard key={q.id} question={q} topicTitle={topicTitle(q.unit)} onAnswered={(c, ch) => answer(q, c, ch)} onAiUse={() => setAssisted(a => ({ ...a, [q.id]: true }))}>
      <div className="cardNav">
        <button type="button" className={answered ? 'btn primary' : 'btn ghost'} onClick={next}>
          {!answered ? 'O‘tkazib yuborish' : index === qs.length - 1 ? 'Natijani ko‘rish' : 'Keyingi savol →'}
        </button>
      </div>
    </QuestionCard>}
  </div>;
}
