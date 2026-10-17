import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import NameGate from './NameGate';
import Logo from './Logo';
import { storage } from '../lib/storage';

const NAV = [
  { href: '/', label: 'Mavzular' },
  { href: '/practice', label: 'Sinov' },
  { href: '/mistakes', label: 'Xatolar' },
  { href: '/settings', label: 'Sozlamalar' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setName(storage.getName());
    const saved = storage.getTheme();
    setDark(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    storage.setTheme(next);
    setDark(!dark);
  };

  const active = (href: string) => href === '/'
    ? router.pathname === '/' || router.pathname.startsWith('/topic')
    : router.pathname.startsWith(href);

  return <>
    <header className="topbar">
      <div className="container navrow">
        <Link href="/" className="brand"><Logo /><span>Informatika <em>olimpiada</em></span></Link>
        <nav className="mainNav" aria-label="Asosiy menyu">
          {NAV.map(n => <Link key={n.href} href={n.href} className={active(n.href) ? 'active' : ''}>{n.label}</Link>)}
        </nav>
        <div className="navTools">
          <button type="button" className="iconBtn" onClick={toggleTheme} aria-label={dark ? 'Yorug‘ rejim' : 'Qorong‘i rejim'} title={dark ? 'Yorug‘ rejim' : 'Qorong‘i rejim'}>
            {dark
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>}
          </button>
          <Link href="/settings" className="userPill" title="Sozlamalar">{name || 'O‘quvchi'}</Link>
        </div>
      </div>
    </header>
    <NameGate onSaved={setName}/>
    <main>{children}</main>
    <footer className="footer">
      <div className="container footRow">
        <span>2024 va 2025–2026 o‘quv yillari 9–11-sinf Informatika olimpiadasi (tuman/shahar bosqichi) savollari asosida.</span>
        <span>Natijalar faqat shu brauzerda saqlanadi.</span>
      </div>
    </footer>
  </>;
}
