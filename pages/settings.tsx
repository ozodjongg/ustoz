import Head from 'next/head';
import { FormEvent, useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { sendTelegramReport } from '../lib/telegram';

export default function Settings() {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [chat, setChat] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setName(storage.getName());
    const t = storage.getTelegram();
    setToken(t.botToken); setChat(t.chatId); setEnabled(t.enabled);
  }, []);

  const save = (e: FormEvent) => {
    e.preventDefault();
    storage.setName(name);
    storage.setTelegram({ botToken: token.trim(), chatId: chat.trim(), enabled });
    setStatus('Saqlandi.');
  };

  const test = async () => {
    storage.setTelegram({ botToken: token.trim(), chatId: chat.trim(), enabled: true });
    setEnabled(true);
    const r = await sendTelegramReport(`✅ Informatika olimpiada — test xabari\nFoydalanuvchi: ${name || 'O‘quvchi'}`);
    setStatus(r.sent ? 'Test xabari yuborildi.' : r.reason || 'Xato');
  };

  return <div className="container section narrow">
    <Head><title>Sozlamalar — Informatika olimpiada</title></Head>
    <div className="eyebrow">Sozlamalar</div>
    <h1>Ism va Telegram hisobot</h1>
    <form className="panel" onSubmit={save}>
      <label>O‘quvchi ismi<input value={name} onChange={e => setName(e.target.value)} placeholder="Masalan: Aziza" /></label>
      <hr />
      <label className="check"><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /><span>Sinov tugaganda natijani Telegram’ga yuborish</span></label>
      <label>Telegram bot token<input type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="123456:ABC..." autoComplete="off" /></label>
      <label>Admin chat ID<input value={chat} onChange={e => setChat(e.target.value)} placeholder="123456789" /></label>
      <div className="warning"><b>Muhim:</b> sayt to‘liq statik, shuning uchun bot token faqat shu brauzer xotirasida (localStorage) saqlanadi va Telegram API’ga to‘g‘ridan-to‘g‘ri yuboriladi. Tokenni hech qachon kodga yoki ommaviy joyga yozmang.</div>
      <div className="row">
        <button className="btn primary" type="submit">Saqlash</button>
        <button className="btn" type="button" onClick={test}>Test xabari</button>
      </div>
      {status && <p className="fine">{status}</p>}
    </form>
  </div>;
}
