import type { Difficulty, Question, Topic } from '../types';

const cache = new Map<string, Promise<Question[]>>();

export function loadUnitQuestions(slug: string): Promise<Question[]> {
  if (!cache.has(slug)) {
    const p = fetch(`/data/questions/${slug}.json`).then(res => {
      if (!res.ok) throw new Error('Savollar yuklanmadi');
      return res.json() as Promise<Question[]>;
    });
    p.catch(() => cache.delete(slug));
    cache.set(slug, p);
  }
  return cache.get(slug)!;
}

export async function loadAllQuestions(topics: Topic[]): Promise<Question[]> {
  const all = await Promise.all(topics.map(t => loadUnitQuestions(t.slug)));
  return all.flat();
}

export const shuffle = <T,>(arr: T[]) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** Olimpiada tuzilmasi: teng ulushda 0,9 / 1,7 / 2,4 ballik savollar, mavzular aralash. */
export function buildExam(all: Question[], total = 30): Question[] {
  const shares: Record<Difficulty, number> = {
    easy: Math.floor(total / 3),
    medium: Math.floor(total / 3),
    hard: Math.floor(total / 3)
  };
  let remainder = total - shares.easy - shares.medium - shares.hard;
  (['hard', 'medium', 'easy'] as Difficulty[]).forEach(k => { if (remainder > 0) { shares[k]++; remainder--; } });
  const order: Difficulty[] = ['easy', 'medium', 'hard'];
  return order.flatMap(d => shuffle(all.filter(q => q.difficulty === d)).slice(0, shares[d]));
}
