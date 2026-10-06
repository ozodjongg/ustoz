import type { GeneratedQuestion } from '../types';

export type TutorMode = 'hint' | 'explain' | 'deep';

type TopicContext = {
  subtopics: string[];
  concepts: string[];
  commonMistakes: string[];
  fastRules: string[];
};

export const TOPIC_AI_CONTEXT: Record<string, TopicContext> = {
  hardware: {
    subtopics: ['kiritish/chiqarish qurilmalari', 'RAM/ROM', 'HDD/SSD va tashqi xotira'],
    concepts: ['input vs output', 'vaqtinchalik vs doimiy xotira', 'qurilma vazifasi'],
    commonMistakes: ['monitorni kiritish qurilmasi deb olish', 'SSD bilan RAMni aralashtirish', 'ROM va RAM vazifalarini almashtirish'],
    fastRules: ['RAM = tez va vaqtinchalik', 'SSD/HDD = uzoq saqlash', 'input kompyuterga kiradi, output kompyuterdan chiqadi']
  },
  files: {
    subtopics: ['fayl kengaytmalari', 'wildcard maskalar', '* va ?', '[A-C] diapazoni'],
    concepts: ['fayl nomi', 'kengaytma', 'maska bo‘yicha moslik'],
    commonMistakes: ['? ni * kabi tushunish', 'kengaytmani tekshirmaslik', '[A-C] ni butun so‘zga tegishli deb o‘ylash'],
    fastRules: ['? = aynan 1 belgi', '* = 0 yoki ko‘p belgi', '[A-C] = A/B/C dan bittasi']
  },
  'data-size-transfer': {
    subtopics: ['bit/byte', 'KB/MB/GB', 'uzatish tezligi', 'arxivlash foizi'],
    concepts: ['1 byte = 8 bit', '1024 asosli birliklar', 'vaqt = hajm / tezlik'],
    commonMistakes: ['MB va Mbitni bir xil olish', '8 ga ko‘paytirishni unutish', 'qisqargan foiz bilan qolgan foizni adashtirish'],
    fastRules: ['1 byte = 8 bit', '1 MB = 1024 KB', 'time = size / speed']
  },
  'algorithms-flowcharts': {
    subtopics: ['ketma-ketlik', 'shart', 'sikl', 'blok-sxema'],
    concepts: ['boshlang‘ich qiymat', 'shart rost/yolg‘on', 'iteratsiya', 'akkumulyator'],
    commonMistakes: ['i=i+1 qadamini unutish', '< bilan <= ni aralashtirish', 'noto‘g‘ri tarmoqni bajarish'],
    fastRules: ['har iteratsiyani jadvalda yoz', 'rombdan keyin faqat bitta yo‘l tanlanadi', 'o‘zgaruvchini yangilash qadamini tashlama']
  },
  python: {
    subtopics: ['for/while', 'if', 'range', 'list', 'string', 'break', 'funksiya'],
    concepts: ['trace', 'modulo %', 'akkumulyator', 'range oxiri kirmasligi'],
    commonMistakes: ['range oxirgi sonni oladi deb o‘ylash', '% ni bo‘lish natijasi deb tushunish', 'breakdan keyin sikl davom etadi deb o‘ylash'],
    fastRules: ['range(a,b) da b olinmaydi', 'x % n == 0 → x n ga qoldiqsiz bo‘linadi', 'break → sikl darhol tugaydi']
  },
  cryptography: {
    subtopics: ['Sezar shifri', 'Vigenère shifri', 'mod 26'],
    concepts: ['harf indekslari', 'shifrlash', 'deshifrlash', 'kalit'],
    commonMistakes: ['siljitish yo‘nalishini almashtirish', 'A=0/A=1 konvensiyasini tekshirmaslik', 'Vigenère kalitini takrorlamaslik'],
    fastRules: ['deshifrlashda siljishni teskari qil', 'alifbo oxirida boshiga qayt', 'Vigenèreda kalitni matn uzunligigacha takrorla']
  },
  'number-systems': {
    subtopics: ['2/8/10/16 lik', 'pozitsion yozuv', 'kasr', 'noma’lum asos'],
    concepts: ['asos', 'raqam qiymati', 'darajalar', 'bo‘lish/ko‘paytirish algoritmi'],
    commonMistakes: ['asosdan katta raqam ishlatish', 'kasrni butun qism kabi o‘tkazish', 'hex A-F qiymatlarini unutish'],
    fastRules: ['n asosda raqamlar 0..n-1', 'A=10 ... F=15', '2↔8 uchun 3 bit, 2↔16 uchun 4 bit']
  },
  'boolean-logic': {
    subtopics: ['AND/OR/NOT', 'NAND/NOR', 'rostlik jadvali', 'mantiqiy sxema'],
    concepts: ['0/1', 'inkor', 'operator ustuvorligi', '2^n kombinatsiya'],
    commonMistakes: ['NAND/NOR oxirgi inkorni unutish', 'NOTni noto‘g‘ri joyga qo‘llash', 'operator tartibini buzish'],
    fastRules: ['AND = ikkalasi ham 1', 'OR = kamida bittasi 1', 'NOT qiymatni teskarilaydi']
  },
  software: {
    subtopics: ['tizimli dastur', 'amaliy dastur', 'dasturlash tili', 'IDE/framework'],
    concepts: ['operatsion tizim', 'foydalanuvchi dasturi', 'til va muhit farqi'],
    commonMistakes: ['IDE ni dasturlash tili deb olish', 'Python interpreterini tilning o‘zi bilan aralashtirish', 'framework va tilni tenglashtirish'],
    fastRules: ['Windows/Linux = tizimli', 'Excel/Photoshop = amaliy', 'Python/Java/C++ = dasturlash tillari']
  },
  excel: {
    subtopics: ['SUM/AVERAGE/MAX/MIN/PRODUCT', 'IF', 'AND', 'diapazonlar'],
    concepts: ['katak manzili', 'funksiya', 'shartli formula', 'hisoblash tartibi'],
    commonMistakes: ['A1:A3 diapazonini noto‘g‘ri o‘qish', 'IF ikkala tarmog‘ini hisoblash', 'ichki funksiyani keyin hisoblash'],
    fastRules: ['ichki qavsni avval hisobla', 'IF faqat bitta tarmoqni qaytaradi', 'A1:A3 → A1,A2,A3']
  },
  'databases-sql': {
    subtopics: ['Primary Key', 'One-to-One/Many', 'SELECT/WHERE/COUNT', 'Access LIKE'],
    concepts: ['jadval', 'yozuv', 'ustun', 'filtr', 'kalit'],
    commonMistakes: ['COUNT o‘rniga SUM ishlatish', 'SELECT va DELETE ni adashtirish', 'takrorlanadigan maydonni primary key qilish'],
    fastRules: ['SELECT = olish', 'WHERE = shart', 'COUNT(*) = satrlar soni']
  },
  colors: {
    subtopics: ['RGB', 'HEX', '16 lik kanal qiymatlari'],
    concepts: ['R/G/B kanallari', '0..255', '#RRGGBB'],
    commonMistakes: ['RGB tartibini almashtirish', 'hex juftliklarini noto‘g‘ri ajratish', 'bir xonali hexni 0 bilan to‘ldirmaslik'],
    fastRules: ['HEX = #RRGGBB', '00=0', 'FF=255']
  },
  multimedia: {
    subtopics: ['audio hajmi', 'video kadrlar', 'rang chuqurligi', 'FPS'],
    concepts: ['sample rate', 'bit depth', 'kanal', 'piksel', 'kadr'],
    commonMistakes: ['daqiqani sekundga o‘tkazmaslik', 'stereo uchun 2 kanalni unutish', 'bitdan bytega /8 ni unutish'],
    fastRules: ['kadrlar = sekund × FPS', 'audio bit = vaqt × Hz × bit × kanal', 'byte = bit / 8']
  },
  'networks-web': {
    subtopics: ['IPv4', 'subnet', 'URL/domain/TLD', 'HTTP status'],
    concepts: ['32 bit IPv4', 'oktet', 'prefix', 'host', 'TLD'],
    commonMistakes: ['oktet 255 dan oshishini tekshirmaslik', 'jami manzil bilan usable hostni tenglashtirish', 'URL va lokal fayl yo‘lini aralashtirish'],
    fastRules: ['IPv4 = 4×8=32 bit', '/n → 2^(32-n) jami manzil', '404 = Not Found']
  },
  modeling: {
    subtopics: ['fizik model', 'matematik model', 'grafik model', 'algoritmik model'],
    concepts: ['soddalashtirilgan nusxa', 'formula', 'maket', 'chizma'],
    commonMistakes: ['modelni obyektning o‘zi deb olish', 'formulani grafik model deb olish', 'maketni matematik model deb olish'],
    fastRules: ['formula → matematik', 'maket → fizik', 'chizma/xarita → grafik']
  },
  'web-tech': {
    subtopics: ['HTML form', 'GET/POST', 'JavaScript frontend', 'Bootstrap'],
    concepts: ['request method', 'framework/kutubxona', 'UI/CSS framework'],
    commonMistakes: ['PUTni oddiy HTML form methodi deb olish', 'Bootstrapni React bilan aynan bir tur deb olish', 'GET/POST vazifasini almashtirish'],
    fastRules: ['HTML form: GET yoki POST', 'React/Angular/Vue → frontend JS', 'Bootstrap → UI/CSS framework']
  },
  'encoding-bits': {
    subtopics: ['ASCII', 'bit bilan kodlash', '2^n holatlar'],
    concepts: ['bit', 'kod', 'belgi', 'minimal bit soni'],
    commonMistakes: ['N obyektga N bit kerak deb o‘ylash', '2^n >= N qoidasini unutish', 'bit va byte ni aralashtirish'],
    fastRules: ['n bit → 2^n holat', 'minimal n: 2^n >= N', '1 byte = 8 bit']
  }
};

const letter = (index: number) => String.fromCharCode(65 + index);

function formatOptions(question: GeneratedQuestion) {
  return question.options.map((option, index) => `${letter(index)}) ${option}`).join('\n');
}

function difficultyLabel(value: GeneratedQuestion['difficulty']) {
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
  question: GeneratedQuestion;
  topicTitle: string;
  userChoice?: number | null;
}) {
  const context = TOPIC_AI_CONTEXT[question.unit];
  const hasAnswer = typeof userChoice === 'number';
  const chosen = hasAnswer ? `${letter(userChoice!)} ) ${question.options[userChoice!]}`.replace(' )', ')') : 'Hali javob tanlanmagan';
  const correct = `${letter(question.answer)}) ${question.options[question.answer]}`;
  const contextBlock = context ? `
KICHIK MAVZULAR:
- ${context.subtopics.join('\n- ')}

ASOSIY TUSHUNCHALAR:
- ${context.concepts.join('\n- ')}

BU MAVZUDA KO‘P UCHRAYDIGAN XATOLAR:
- ${context.commonMistakes.join('\n- ')}

TEZKOR QOIDALAR:
- ${context.fastRules.join('\n- ')}
` : '';

  const shared = `Sen O‘zbekiston 9–11-sinf Informatika fanidan tuman/shahar olimpiadasiga tayyorlovchi kuchli, sabrli va aniq AI-o‘qituvchisan.

Vazifang — javobni shunchaki aytish emas, o‘quvchining aynan qayerda tushunmayotganini topib, o‘sha bilim bo‘shlig‘ini yopish.

KONTEKST:
- Manba yo‘nalishi: 2025-yil O‘zbekiston Informatika tuman/shahar olimpiadasi mavzulari asosida tuzilgan mashq
- Mavzu: ${topicTitle}
- Savol ID: ${question.id}
- Qiyinlik: ${difficultyLabel(question.difficulty)}
- Ball: ${question.points}
${contextBlock}
SAVOL:
${question.prompt}

JAVOB VARIANTLARI:
${formatOptions(question)}

O‘QUVCHI TANLAGAN JAVOB:
${chosen}

Saytdagi qisqa izoh:
${question.explanation}

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

MUHIM: To‘g‘ri javobning harfini ham, matnini ham AYTMAGIN. Saytdagi qisqa izohdan yakuniy javobni oshkor qilish uchun foydalanma.

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
