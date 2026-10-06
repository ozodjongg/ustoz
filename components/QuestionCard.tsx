import { useState } from 'react';
import type { GeneratedQuestion } from '../types';
import AiTutorActions from './AiTutorActions';

export default function QuestionCard({
  question,
  topicTitle,
  onAnswered,
  reveal = true
}: {
  question: GeneratedQuestion;
  topicTitle: string;
  onAnswered?: (correct:boolean)=>void;
  reveal?: boolean;
}) {
  const [choice,setChoice]=useState<number|null>(null);
  const answered=choice!==null;
  const correct=choice===question.answer;
  const choose=(i:number)=>{
    if(answered) return;
    setChoice(i);
    onAnswered?.(i===question.answer);
  };

  return <div className="questionCard">
    <div className="questionMeta">
      <span className={`badge ${question.difficulty}`}>{question.difficulty==='easy'?'0.9 ball':question.difficulty==='medium'?'1.5 ball':'2.6 ball'}</span>
      <span>{question.id}</span>
    </div>
    <h3>{question.prompt}</h3>
    <div className="options">
      {question.options.map((o,i)=>{
        const cls = answered ? (i===question.answer?'option correct':i===choice?'option wrong':'option') : 'option';
        return <button key={i} className={cls} onClick={()=>choose(i)} disabled={answered}><b>{String.fromCharCode(65+i)}</b><span>{o}</span></button>;
      })}
    </div>

    <AiTutorActions
      key={question.id}
      question={question}
      topicTitle={topicTitle}
      userChoice={choice}
      compact
    />

    {answered && reveal && <div className={`feedback ${correct?'ok':'bad'}`}>
      <b>{correct?'To‘g‘ri!':'Xato.'}</b> {question.explanation}
    </div>}
  </div>;
}
