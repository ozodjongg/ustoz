import { useEffect, useMemo, useState } from 'react';
import type { Question } from '../types';
import { buildTutorPrompt, tutorModeLabel, type TutorMode } from '../lib/aiTutor';

const MODE_LEAD: Record<TutorMode, string> = {
  hint: 'Bu prompt AI ga javobni aytmasdan, faqat bitta yo‘naltiruvchi maslahat berishni buyuradi.',
  explain: 'Bu prompt javobingizni tahlil qilib, masalani qadam-baqadam o‘rgatadi.',
  deep: 'Bu prompt AI ni repetitor rejimiga o‘tkazadi: mikro-dars va ketma-ket interaktiv savollar.',
};

export default function AiTutorActions({
  question,
  topicTitle,
  userChoice = null,
  onUse,
}: {
  question: Question;
  topicTitle: string;
  userChoice?: number | null;
  onUse?: (mode: TutorMode) => void;
}) {
  const [mode, setMode] = useState<TutorMode | null>(null);
  const [status, setStatus] = useState('');
  const prompt = useMemo(() => mode ? buildTutorPrompt({ mode, question, topicTitle, userChoice }) : '', [mode, question, topicTitle, userChoice]);
  const answered = typeof userChoice === 'number';

  useEffect(() => {
    if (!mode) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMode(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode]);

  const open = (next: TutorMode) => {
    if (next !== 'hint' && !answered) return;
    setStatus('');
    setMode(next);
    onUse?.(next);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(prompt); return true; } catch { return false; }
  };

  const copyOnly = async () => setStatus(await copy() ? 'Prompt nusxalandi.' : 'Nusxalash ishlamadi — matnni qo‘lda belgilab nusxalang.');

  const openIn = async (target: 'claude' | 'chatgpt') => {
    const ok = await copy();
    const url = target === 'claude'
      ? (prompt.length < 7000 ? `https://claude.ai/new?q=${encodeURIComponent(prompt)}` : 'https://claude.ai/new')
      : 'https://chatgpt.com/';
    window.open(url, '_blank', 'noopener,noreferrer');
    setStatus(ok ? 'Prompt nusxalandi. Yangi oynada kerak bo‘lsa joylashtiring (Ctrl+V).' : 'Yangi oyna ochildi. Promptni pastdan nusxalang.');
  };

  return <>
    <div className="aiBar">
      <span className="aiBarTitle"><span className="aiDot" aria-hidden="true">✳</span>AI yordamchi</span>
      <div className="aiBarButtons">
        <button type="button" className="chip" onClick={() => open('hint')}>Maslahat</button>
        <button type="button" className="chip" disabled={!answered} onClick={() => open('explain')} title={answered ? '' : 'Avval javob tanlang'}>Tushuntir</button>
        <button type="button" className="chip" disabled={!answered} onClick={() => open('deep')} title={answered ? '' : 'Avval javob tanlang'}>Chuqur o‘rgan</button>
      </div>
    </div>

    {mode && <div className="modalBackdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setMode(null); }}>
      <div className="aiModal" role="dialog" aria-modal="true" aria-label="AI yordamchi">
        <div className="aiModalHead">
          <div><div className="eyebrow">AI yordamchi · {tutorModeLabel(mode)}</div><h2>{topicTitle}</h2></div>
          <button className="iconBtn" onClick={() => setMode(null)} aria-label="Yopish">×</button>
        </div>
        <p className="muted">{MODE_LEAD[mode]}</p>
        <textarea className="promptPreview" readOnly value={prompt} rows={14} />
        <div className="row">
          <button type="button" className="btn primary" onClick={() => openIn('claude')}>Claude’da ochish</button>
          <button type="button" className="btn" onClick={() => openIn('chatgpt')}>ChatGPT’da ochish</button>
          <button type="button" className="btn ghost" onClick={copyOnly}>Nusxalash</button>
        </div>
        {status && <div className="copyStatus">{status}</div>}
        <p className="fine">Sayt hech qanday AI kalitini saqlamaydi: prompt brauzeringizda tayyorlanadi.</p>
      </div>
    </div>}
  </>;
}
