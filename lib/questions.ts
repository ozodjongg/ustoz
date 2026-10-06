import type { Difficulty, GeneratedQuestion, Unit } from '../types';

export async function loadUnitQuestions(slug: string): Promise<GeneratedQuestion[]> {
  const res = await fetch(`/data/questions/${slug}.json`);
  if (!res.ok) throw new Error('Savollar yuklanmadi');
  return res.json();
}

export async function loadAllQuestions(units: Unit[]): Promise<GeneratedQuestion[]> {
  const all = await Promise.all(units.map(u => loadUnitQuestions(u.slug)));
  return all.flat();
}

const pick = <T,>(arr: T[], count: number) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
};

export function buildExam(all: GeneratedQuestion[], total = 30): GeneratedQuestion[] {
  const shares: Record<Difficulty, number> = {
    easy: Math.floor(total / 3),
    medium: Math.floor(total / 3),
    hard: Math.floor(total / 3)
  };
  let remainder = total - shares.easy - shares.medium - shares.hard;
  (['hard','medium','easy'] as Difficulty[]).forEach(k => { if (remainder > 0) { shares[k]++; remainder--; } });
  const chosen = (Object.keys(shares) as Difficulty[]).flatMap(d => pick(all.filter(q => q.difficulty === d), shares[d]));
  return pick(chosen, chosen.length);
}
