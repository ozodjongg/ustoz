import { FormEvent, useEffect, useState } from 'react';
import { storage } from '../lib/storage';

export default function NameGate({ onSaved }: { onSaved?: (name:string)=>void }) {
  const [open,setOpen]=useState(false); const [name,setName]=useState('');
  useEffect(()=>{ const n=storage.getName(); if(!n) setOpen(true); else setName(n); },[]);
  if(!open) return null;
  const save=(e:FormEvent)=>{e.preventDefault(); const n=name.trim(); if(!n) return; storage.setName(n); onSaved?.(n); setOpen(false);};
  return <div className="modalBackdrop">
    <form className="modal" onSubmit={save}>
      <div className="eyebrow">Boshlashdan oldin</div>
      <h2>Ismingizni kiriting</h2>
      <p>Natijalar shu ism bilan saqlanadi va Telegram xabari yoqilgan bo‘lsa, admin hisobotida ko‘rinadi.</p>
      <input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Masalan: Aziz" />
      <button className="btn primary" type="submit">Davom etish</button>
    </form>
  </div>;
}
