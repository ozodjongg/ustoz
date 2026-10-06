import { storage } from './storage';

export async function sendTelegramReport(message: string): Promise<{sent: boolean; reason?: string}> {
  const cfg = storage.getTelegram();
  if (!cfg.enabled) return { sent:false, reason:'Telegram o‘chirilgan' };
  if (!cfg.botToken || !cfg.chatId) return { sent:false, reason:'Bot token yoki chat ID kiritilmagan' };
  try {
    const url = `https://api.telegram.org/bot${encodeURIComponent(cfg.botToken)}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: cfg.chatId, text: message })
    });
    if (!res.ok) return { sent:false, reason:`Telegram API: ${res.status}` };
    return { sent:true };
  } catch (e) {
    return { sent:false, reason:e instanceof Error ? e.message : 'Tarmoq xatosi' };
  }
}
