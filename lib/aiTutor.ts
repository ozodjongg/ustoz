import type { Question } from '../types';
import { topicBySlug } from './topics';

export type TutorMode = 'hint' | 'explain' | 'deep';

const letter = (index: number) => String.fromCharCode(65 + index);

function formatOptions(question: Question) {
  return question.options.map((option, index) => `${letter(index)}) ${option}`).join('\n');
}

function difficultyLabel(value: Question['difficulty']) {
  if (value === 'easy') return 'Boshlang‘ich';
  if (value === 'medium') return 'O‘rta';
  return 'Olimpiada';
}

export function buildTutorPrompt({
  mode,
  question,
  topicTitle,
  userChoice,
}: {
  mode: TutorMode;
  question: Question;
  topicTitle: string;
  userChoice?: number | null;
}) {
  const context = topicBySlug(question.unit)?.ai;
  const hasAnswer = typeof userChoice === 'number';
  const chosen = hasAnswer ? `${letter(userChoice!)} ) ${question.options[userChoice!]}`.replace(' )', ')') : 'Hali javob tanlanmagan';
  const correct = `${letter(question.answer)}) ${question.options[question.answer]}`;
  const siteSolution = `SAYTDAGI QADAM-BAQADAM YECHIM (tekshirish uchun):
${question.solution.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
  const contextBlock = context ? `
KICHIK MAVZULAR:
- ${context.subtopics.join('\n- ')}

BU MAVZUDA KO‘P UCHRAYDIGAN XATOLAR:
- ${context.mistakes.join('\n- ')}

TEZKOR QOIDALAR:
- ${context.rules.join('\n- ')}
` : '';

  const shared = `Sen O‘zbekiston 9–11-sinf Informatika fanidan tuman/shahar olimpiadasiga tayyorlovchi kuchli, sabrli va aniq AI-o‘qituvchisan.

Vazifang — javobni shunchaki aytish emas, o‘quvchining aynan qayerda tushunmayotganini topib, o‘sha bilim bo‘shlig‘ini yopish.

KONTEKST:
- Manba yo‘nalishi: O‘zbekiston Informatika fan olimpiadasi tuman/shahar bosqichi (9–11-sinf, 2024 va 2025–2026 o‘quv yillari) savollari asosida tuzilgan mashq
- Mavzu: ${topicTitle}
- Savol ID: ${question.id}
- Qiyinlik: ${difficultyLabel(question.difficulty)}
- Ball: ${question.points}
${contextBlock}
SAVOL:
${question.prompt}${question.code ? `\n\nKOD:\n${question.code}` : ''}

JAVOB VARIANTLARI:
${formatOptions(question)}

O‘QUVCHI TANLAGAN JAVOB:
${chosen}

UMUMIY QOIDALAR:
1. O‘zbek tilida, sodda va ravon yoz.
2. Maktab o‘quvchisi mavzuni noldan o‘rganayotgandek tushuntir, lekin ilmiy aniqlikni yo‘qotma.
3. Hech bir muhim hisob, kod trace, mantiqiy qadam yoki birlik almashtirishni tashlab ketma.
4. Savol yoki berilgan javob kalitida nomuvofiqlik bo‘lsa, uni ko‘r-ko‘rona qabul qilma: mustaqil tekshir va aniq ayt.
5. Yetishmayotgan ma’lumot bo‘lsa taxmin qilma; qaysi ma’lumot yetishmayotganini ayt.
6. Kod bo‘lsa satrma-satr trace qil; sanoq sistemasi bo‘lsa oraliq o‘tishlarni ko‘rsat; mantiqda kerak bo‘lsa rostlik jadvali tuz; hajm/tezlikda birliklarni alohida yoz.
7. O‘quvchini kamsitma va "bu juda oson" kabi iboralarni ishlatma.
`;

  if (mode === 'hint') {
    return `${shared}

HOZIRGI REJIM: FAQAT HINT.

MUHIM: To‘g‘ri javobning harfini ham, matnini ham AYTMAGIN.

Quyidagicha javob ber:
1. Savol aslida qaysi tushunchani tekshirayotganini 1–2 jumlada ayt.
2. Faqat BITTA kichik hint ber.
3. Zarur bo‘lsa bitta formula yoki bitta qoida ber, lekin hisobni oxirigacha tugatma.
4. "Endi o‘zing urinib ko‘r: ..." deb o‘quvchiga keyingi qadamni topshir.
5. Shu yerda to‘xta va o‘quvchining javobini kut.

Agar o‘quvchi keyin "yana hint" desa, oldingisidan biroz kuchliroq BITTA hint ber. Baribir yakuniy javobni oshkor qilma.`;
  }

  if (mode === 'explain') {
    return `${shared}

TO‘G‘RI JAVOB KALITI:
${correct}

${siteSolution}

HOZIRGI REJIM: SAVOLNI TO‘LIQ TUSHUNTIRISH.

Quyidagi tartibda ishlagin:
1. "Savol nimani so‘rayapti?" — savolni sodda tilda qayta ayt.
2. "Buning uchun nimani bilish kerak?" — faqat kerakli nazariyani noldan tushuntir.
3. "Qadam-baqadam yechim" — har qadamda NIMA qilayotganimiz va NEGA qilayotganimizni yoz.
4. "Sening javobing tahlili" — o‘quvchi tanlagan ${chosen} javobini tahlil qil. Agar xato bo‘lsa, aynan qaysi fikrlash xatosi bunga olib kelgan bo‘lishi mumkinligini tushuntir.
5. "Variantlar tahlili" — A, B, C, D variantlarining har birini qisqa tekshir.
6. "Olimpiadada tez yechish" — shu tipdagi savolni tez va xavfsiz yechish usulini ko‘rsat.
7. "Eslab qol" — 1–3 ta juda qisqa qoida yoz.
8. Oxirida ayni tushunchani tekshiradigan BITTA yangi, o‘xshash savol ber. Uning javobini yozma va o‘quvchining javobini kut.

To‘g‘ri javob kalitini ham mustaqil tekshir. Agar kalit noto‘g‘ri ko‘rinsa, buni alohida ayt.`;
  }

  return `${shared}

TO‘G‘RI JAVOB KALITI:
${correct}

${siteSolution}

HOZIRGI REJIM: CHUQUR AI-REPETITOR.

Maqsad: o‘quvchining shu savoldan ko‘rinayotgan bilim bo‘shlig‘ini topish va uni mustahkamlash.

Boshlanishida:
1. Savolni mustaqil yechib, kalitni tekshir.
2. O‘quvchi javobi ${chosen} asosida 1–3 ta ehtimoliy bilim bo‘shlig‘ini aniqlagin.
3. Eng asosiy bitta bo‘shliqni tanla va 5 daqiqalik mikro-dars qil:
   - juda sodda ta’rif;
   - bitta hayotiy o‘xshatish;
   - formula/qoida;
   - qadam-baqadam ishlangan bitta misol;
   - ko‘p uchraydigan xato.

Keyin INTERAKTIV REJIMGA o‘t:
4. Faqat BITTA tekshiruv savoli ber va JAVOBINI AYTMAGIN.
5. O‘quvchining keyingi javobini kut.
6. Xato qilsa, aynan xatosiga mos mikro-tushuntirish ber va undan biroz osonroq bitta savol ber.
7. To‘g‘ri javob bersa, biroz qiyinroq bitta savol ber.
8. Ketma-ket 3 ta savolni mustaqil to‘g‘ri ishlamaguncha "mavzu o‘zlashtirildi" deb aytma.
9. Har safar faqat BITTA savol ber; o‘quvchi javob bermasdan keyingisiga o‘tma.
10. 3 ta ketma-ket to‘g‘ri javobdan so‘ng "Eslab qol" kartochkasi va bitta olimpiada darajasidagi yakuniy tavsiya ber.

Birinchi javobing mikro-dars + BITTA tekshiruv savoli bilan tugasin.`;
}

export function tutorModeLabel(mode: TutorMode) {
  if (mode === 'hint') return 'Hint';
  if (mode === 'explain') return 'Tushuntirish';
  return 'Chuqur o‘rganish';
}
