import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import NameGate from './NameGate';
import { storage } from '../lib/storage';

export default function Layout({ children }: { children: ReactNode }) {
  const [name,setName] = useState('');
  useEffect(()=>setName(storage.getName()),[]);
  return <>
    <header className="topbar">
      <div className="container navrow">
        <Link href="/" className="brand"><span className="brandMark">IO</span><span>Informatika Olimpiada</span></Link>
        <nav>
          <Link href="/practice">Sinov</Link>
          <Link href="/mistakes">Xatolar</Link>
          <Link href="/settings">Sozlamalar</Link>
        </nav>
        <div className="userPill">{name || 'O‘quvchi'}</div>
      </div>
    </header>
    <NameGate onSaved={setName}/>
    <main>{children}</main>
    <footer className="footer"><div className="container">2025-yil 9–11-sinf olimpiada savollari mavzulari asosida. Natijalar brauzerning localStorage xotirasida saqlanadi.</div></footer>
  </>;
}
