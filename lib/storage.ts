import type { ExamHistory, MistakeStats } from '../types';

const NAME = 'io_name';
const MISTAKES = 'io_mistakes_v1';
const HISTORY = 'io_history_v1';
const TELEGRAM = 'io_telegram_v1';

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  try { return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
};

export const storage = {
  getName(): string { return typeof window === 'undefined' ? '' : localStorage.getItem(NAME) || ''; },
  setName(name: string) { localStorage.setItem(NAME, name.trim()); },
  getMistakes(): MistakeStats { return typeof window === 'undefined' ? {} : safeParse(localStorage.getItem(MISTAKES), {}); },
  addMistake(unit: string, questionId: string) {
    const all = this.getMistakes();
    const old = all[unit] || { count: 0, lastSeen: '', questionIds: [] };
    all[unit] = {
      count: old.count + 1,
      lastSeen: new Date().toISOString(),
      questionIds: Array.from(new Set([questionId, ...old.questionIds])).slice(0, 50)
    };
    localStorage.setItem(MISTAKES, JSON.stringify(all));
  },
  clearMistakes(unit?: string) {
    if (!unit) localStorage.removeItem(MISTAKES);
    else { const all = this.getMistakes(); delete all[unit]; localStorage.setItem(MISTAKES, JSON.stringify(all)); }
  },
  getHistory(): ExamHistory[] { return typeof window === 'undefined' ? [] : safeParse(localStorage.getItem(HISTORY), []); },
  addHistory(item: ExamHistory) {
    const all = [item, ...this.getHistory()].slice(0, 30);
    localStorage.setItem(HISTORY, JSON.stringify(all));
  },
  getTelegram(): { botToken: string; chatId: string; enabled: boolean } {
    return typeof window === 'undefined' ? { botToken:'', chatId:'', enabled:false } : safeParse(localStorage.getItem(TELEGRAM), { botToken:'', chatId:'', enabled:false });
  },
  setTelegram(value: { botToken: string; chatId: string; enabled: boolean }) {
    localStorage.setItem(TELEGRAM, JSON.stringify(value));
  }
};
