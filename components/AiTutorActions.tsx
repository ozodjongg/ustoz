import { useMemo, useState } from 'react';
import type { GeneratedQuestion } from '../types';
import { buildTutorPrompt, tutorModeLabel, type TutorMode } from '../lib/aiTutor';

export default function AiTutorActions({
  question,
  topicTitle,
  userChoice = null,
  onUse,
  compact = false,
}: {
  question: GeneratedQuestion;
  topicTitle: string;
  userChoice?: number | null;
  onUse?: (mode: TutorMode) => void;
  compact?: boolean;
}) {
  const [mode,setMode]=useState<TutorMode|null>(null);
  const [status,setStatus]=useState('');
  const prompt=useMemo(()=>mode ? buildTutorPrompt({mode,question,topicTitle,userChoice}) : '',[mode,question,topicTitle,userChoice]);
  const answered=typeof userChoice==='number';

  const open=(nextMode:TutorMode)=>{
    if(nextMode!=='hint'&&!answered) return;
    setStatus('');
    setMode(nextMode);
    onUse?.(nextMode);
  };

  const copy=async()=>{
    try{
      await navigator.clipboard.writeText(prompt);
      setStatus('Prompt nusxalandi.');
    }catch{
      setStatus('Nusxalash ishlamadi. Promptni pastdagi maydondan qo‘lda nusxalang.');
    }
  };

  const openChatGPT=async()=>{
    try{ await navigator.clipboard.writeText(prompt); }catch{}
    window.open('https://chatgpt.com/','_blank','noopener,noreferrer');
    setStatus('Prompt nusxalandi. ChatGPT oynasida uni joylashtiring.');
  };

  return <>
    <div className={`aiTutorBar ${compact?'compact':''}`}>
      <div className="aiTutorTitle"><span className="aiSpark">AI</span><div><b>Tushunmadim?</b><small>Savol konteksti bilan mukammal prompt tayyorlanadi</small></div></div>
      <div className="aiTutorButtons">
        <button type="button" className="aiBtn hint" onClick={()=>open('hint')}>💡 Hint ber</button>
        <button type="button" className="aiBtn explain" disabled={!answered} onClick={()=>open('explain')}>🧠 Tushuntir</button>
        <button type="button" className="aiBtn deep" disabled={!answered} onClick={()=>open('deep')}>✦ Chuqur o‘rgan</button>
      </div>
      {!answered && <small className="aiTutorNote">Hint javobni ochmaydi. To‘liq tahlil uchun avval o‘zingiz javob bering.</small>}
    </div>

    {mode && <div className="modalBackdrop aiModalBackdrop" onMouseDown={(e)=>{if(e.target===e.currentTarget)setMode(null)}}>
      <div className="aiModal">
        <div className="aiModalHead">
          <div><div className="eyebrow">AI Tutor · {tutorModeLabel(mode)}</div><h2>{topicTitle}</h2></div>
          <button className="modalClose" onClick={()=>setMode(null)} aria-label="Yopish">×</button>
        </div>
        <p className="aiModalLead">{mode==='hint'?'Bu prompt AIga javobni oshkor qilmasdan faqat bitta yo‘naltiruvchi hint berishni buyuradi.':mode==='explain'?'Bu prompt sizning javobingizni ham tahlil qilib, masalani qadam-baqadam o‘rgatadi.':'Bu prompt AIni repetitor rejimiga o‘tkazadi: mikro-dars va ketma-ket interaktiv savollar.'}</p>
        <textarea className="promptPreview" readOnly value={prompt} rows={16}/>
        <div className="aiModalActions">
          <button type="button" className="btn" onClick={copy}>Promptni nusxalash</button>
          <button type="button" className="btn primary" onClick={openChatGPT}>ChatGPTda ochish</button>
          <button type="button" className="btn ghost" onClick={()=>setMode(null)}>Yopish</button>
        </div>
        {status && <div className="copyStatus">{status}</div>}
        <div className="aiPrivacy">Sayt AI API kalitini saqlamaydi. Prompt brauzeringizda tayyorlanadi; ChatGPT tugmasi promptni clipboardga nusxalab, yangi oynada ChatGPTni ochadi.</div>
      </div>
    </div>}
  </>;
}
