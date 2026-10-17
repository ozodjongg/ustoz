// Statik savol banklarining yaxlitligini tekshiradi (hech narsa generatsiya qilmaydi).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const topics = JSON.parse(readFileSync(join(root, 'data/topics.json'), 'utf8')).topics;
const dir = join(root, 'public/data/questions');
const files = new Set(readdirSync(dir));
const errors = [];
const ids = new Set();
const POINTS = { easy: 0.9, medium: 1.7, hard: 2.4 };

for (const t of topics) {
  const file = `${t.slug}.json`;
  if (!files.has(file)) { errors.push(`${t.slug}: savol fayli yo‘q`); continue; }
  files.delete(file);
  const qs = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  if (qs.length !== 50) errors.push(`${t.slug}: ${qs.length} ta savol (50 bo‘lishi kerak)`);
  if (t.question_count !== qs.length) errors.push(`${t.slug}: question_count mos emas`);
  for (const q of qs) {
    const where = `${t.slug}/${q.id}`;
    if (ids.has(q.id)) errors.push(`${where}: takroriy id`);
    ids.add(q.id);
    if (q.unit !== t.slug) errors.push(`${where}: unit noto‘g‘ri`);
    if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`${where}: 4 ta variant bo‘lishi kerak`);
    else if (new Set(q.options).size !== 4) errors.push(`${where}: variantlar takrorlangan`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) errors.push(`${where}: answer indeksi noto‘g‘ri`);
    if (POINTS[q.difficulty] !== q.points) errors.push(`${where}: ball va qiyinlik mos emas`);
    if (!q.prompt?.trim()) errors.push(`${where}: savol matni bo‘sh`);
    if (!Array.isArray(q.solution) || q.solution.length === 0 || q.solution.some(s => !s.trim())) errors.push(`${where}: yechim bo‘sh`);
  }
  if (!t.lesson?.sections?.length) errors.push(`${t.slug}: dars bo‘limlari yo‘q`);
}
for (const extra of files) errors.push(`${extra}: topics.json da yo‘q`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`OK: ${topics.length} mavzu, ${ids.size} savol`);
