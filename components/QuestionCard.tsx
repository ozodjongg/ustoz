import { ReactNode, useState } from 'react';
import type { Question } from '../types';
import { pointsLabel } from '../lib/topics';
import AiTutorActions from './AiTutorActions';
import SolutionSteps from './SolutionSteps';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({
  question,
  topicTitle,
  label,
  onAnswered,
  onAiUse,
  children,
}: {
  question: Question;
  topicTitle: string;
  /** Yuqori o‘ng burchakdagi yozuv (masalan, «12 / 50» yoki mavzu nomi). */
  label?: string;
  /** choice = −1 — foydalanuvchi «Bilmayman» ni bosdi. */
  onAnswered?: (correct: boolean, choice: number) => void;
  onAiUse?: () => void;
  children?: ReactNode;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const answered = choice !== null;
  const correct = choice === question.answer;

  const choose = (i: number) => {
    if (answered) return;
    setChoice(i);
    const ok = i === question.answer;
    if (!ok) setOpen(true);
    onAnswered?.(ok, i);
  };

  return <article className="questionCard">
    <div className="questionMeta">
      <span className={`badge ${question.difficulty}`}>{pointsLabel(question.points)}</span>
      <span className="qLabel">{label ?? topicTitle}</span>
    </div>

    <h3 className="qPrompt">{question.prompt}</h3>
    {question.code && <pre className="codeBlock"><code>{question.code}</code></pre>}

    <div className="options" role="list">
      {question.options.map((o, i) => {
        const cls = !answered ? 'option' : i === question.answer ? 'option correct' : i === choice ? 'option wrong' : 'option dim';
        return <button key={i} type="button" className={cls} onClick={() => choose(i)} disabled={answered}>
          <b>{LETTERS[i]}</b><span className="optText">{o}</span>
        </button>;
      })}
    </div>

    {!answered && <button type="button" className="linkBtn" onClick={() => choose(-1)}>Bilmayman — yechimni ko‘rsat</button>}

    {answered && <div className={`feedback ${correct ? 'ok' : 'bad'}`}>
      <div className="feedbackHead">
        <b>{correct ? 'To‘g‘ri!' : choice === -1 ? `To‘g‘ri javob: ${LETTERS[question.answer]}` : `Xato. To‘g‘ri javob: ${LETTERS[question.answer]}`}</b>
        <span>{question.explanation}</span>
      </div>
      <button type="button" className="solutionToggle" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        {open ? 'Yechimni yopish' : 'Qadam-baqadam yechimni ko‘rish'}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={open ? 'rot' : ''}><path d="m6 9 6 6 6-6"/></svg>
      </button>
      {open && <SolutionSteps steps={question.solution} />}
    </div>}

    <AiTutorActions key={question.id} question={question} topicTitle={topicTitle} userChoice={choice !== null && choice >= 0 ? choice : null} onUse={onAiUse} />

    {children}
  </article>;
}
