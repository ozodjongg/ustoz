import type { ExamHistory, MistakeStats, ProgressMap } from '../types';

const NAME = 'io_name';
const MISTAKES = 'io_mistakes_v2';
const HISTORY = 'io_history_v1';
const TELEGRAM = 'io_telegram_v1';
const PROGRESS = 'io_progress_v1';
const THEME = 'io_theme';

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  try { return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
};

const read = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(key); } catch { return null; }
};

const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch { /* localStorage yopiq bo‘lishi mumkin */ }
};

export const storage = {
  getName(): string { return read(NAME) || ''; },
  setName(name: string) { write(NAME, name.trim()); },

  getMistakes(): MistakeStats { return safeParse(read(MISTAKES), {}); },
  addMistake(unit: string, questionId: string) {
    const all = this.getMistakes();
    const old = all[unit] || { count: 0, lastSeen: '', questionIds: [] };
    all[unit] = {
      count: old.count + 1,
      lastSeen: new Date().toISOString(),
      questionIds: Array.from(new Set([questionId, ...old.questionIds])).slice(0, 50)
    };
    write(MISTAKES, JSON.stringify(all));
  },
  /** To‘g‘ri yechilgan savolni xatolar ro‘yxatidan chiqaradi. */
  resolveMistake(unit: string, questionId: string) {
    const all = this.getMistakes();
    const old = all[unit];
    if (!old || !old.questionIds.includes(questionId)) return;
    const questionIds = old.questionIds.filter(id => id !== questionId);
    if (questionIds.length === 0) delete all[unit];
    else all[unit] = { ...old, questionIds };
    write(MISTAKES, JSON.stringify(all));
  },
  clearMistakes(unit?: string) {
    if (!unit) write(MISTAKES, null);
    else { const all = this.getMistakes(); delete all[unit]; write(MISTAKES, JSON.stringify(all)); }
  },

  getProgress(): ProgressMap { return safeParse(read(PROGRESS), {}); },
  setProgress(questionId: string, correct: boolean) {
    const all = this.getProgress();
    all[questionId] = correct;
    write(PROGRESS, JSON.stringify(all));
  },
  clearProgress(prefix: string) {
    const all = this.getProgress();
    Object.keys(all).forEach(k => { if (k.startsWith(prefix)) delete all[k]; });
    write(PROGRESS, JSON.stringify(all));
  },

  getHistory(): ExamHistory[] { return safeParse(read(HISTORY), []); },
  addHistory(item: ExamHistory) {
    const all = [item, ...this.getHistory()].slice(0, 30);
    write(HISTORY, JSON.stringify(all));
  },

  getTelegram(): { botToken: string; chatId: string; enabled: boolean } {
    return safeParse(read(TELEGRAM), { botToken: '', chatId: '', enabled: false });
  },
  setTelegram(value: { botToken: string; chatId: string; enabled: boolean }) {
    write(TELEGRAM, JSON.stringify(value));
  },

  getTheme(): 'light' | 'dark' | '' { const t = read(THEME); return t === 'light' || t === 'dark' ? t : ''; },
  setTheme(theme: 'light' | 'dark') { write(THEME, theme); }
};
