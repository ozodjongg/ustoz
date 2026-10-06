# Informatika Olimpiada Trainer

2025-yil O‘zbekiston 9-, 10- va 11-sinf Informatika fan olimpiadasi tuman (shahar) bosqichidagi 90 ta test savolining mavzu tahlili asosida tuzilgan **to‘liq statik Next.js** tayyorgarlik sayti.

## Nimalar tayyor

- `unit.json` — 90 original savol uchun sinf, savol raqami, ball, rasmiy javob, mavzu va qisqa mazmun; 17 ta birlashtirilgan unit.
- `public/data/questions/*.json` — har bir unit uchun 100 tadan yangi mashq, jami **1700 ta savol**.
- Har bir mavzu uchun juda sodda, bosqichma-bosqich dars sahifasi.
- Har mavzu sahifasida tasodifiy savol.
- **AI Tutor**: har bir savol uchun kontekstga mos mukammal promptni avtomatik tuzadi.
- AI Tutor 3 rejimda ishlaydi: **Hint**, **Tushuntirish**, **Chuqur o‘rganish**.
- Hint rejimi to‘g‘ri javobni promptga kiritmaydi; o‘quvchini mustaqil yechimga yo‘naltiradi.
- Tushuntirish rejimi foydalanuvchi tanlagan javobni, variantlarni va xato sababini tahlil qilishni AIga buyuradi.
- Chuqur rejim AIni mikro-dars + adaptiv savollar beradigan repetitorga aylantiradi va ketma-ket 3 ta mustaqil to‘g‘ri javobgacha davom etishni so‘raydi.
- Vaqt va savollar sonini foydalanuvchi o‘zi tanlaydigan sinov.
- Original ball tizimi: 0.9 / 1.5 / 2.6.
- Xato savollar mavzusi `localStorage` ga saqlanadi.
- Sinov natijasida nechta savolda AI yordami ishlatilgani alohida hisoblanadi va Telegram hisobotiga qo‘shiladi.
- Ism birinchi kirishda so‘raladi.
- Sinov tugagach Telegram Bot API orqali admin xabarini yuborish opsiyasi.
- Backend yo‘q: `next.config.mjs` ichida `output: 'export'`.

## Ishga tushirish

```bash
npm install
npm run dev
```

Static build:

```bash
npm run build
```

`npm run dev` va `npm run build` oldidan `scripts/generate_data.py` avtomatik ishga tushib, `unit.json` va 17 × 100 savol bankini yaratadi.

Natija `out/` papkasiga chiqadi.

## Telegram xavfsizligi

Backend bo‘lmagani uchun bot tokenini ommaviy source code yoki `NEXT_PUBLIC_*` o‘zgaruvchiga qo‘shish xavfsiz emas. Hozirgi rejimda token faqat admin/o‘qituvchi brauzerining `localStorage` xotirasida saqlanadi.

Public deploymentda tokenni yashirish uchun kichik serverless proxy kerak bo‘ladi.


## AI Tutor qanday ishlaydi

Loyiha backend yoki AI API kalitiga bog‘lanmagan. Har bir savolda sayt quyidagi kontekstni o‘zi yig‘adi:

- mavzu va kichik mavzular;
- qiyinlik va ball;
- savol va A/B/C/D variantlar;
- foydalanuvchi tanlagan javob;
- kerak bo‘lsa to‘g‘ri javob;
- shu mavzudagi asosiy tushunchalar;
- keng tarqalgan xatolar;
- olimpiadada tez ishlatiladigan qoidalar.

`lib/aiTutor.ts` 17 ta unit uchun alohida pedagogik kontekst saqlaydi. `components/AiTutorActions.tsx` shu ma’lumotlardan uch xil prompt yaratadi.

### 1. Hint

To‘g‘ri javob promptga kiritilmaydi. AIga faqat bitta kichik yo‘naltiruvchi hint berish va o‘quvchining keyingi urinishini kutish buyuriladi.

### 2. Tushuntirish

AI:
1. savolni sodda tilda qayta aytadi;
2. kerakli nazariyani noldan tushuntiradi;
3. qadam-baqadam yechadi;
4. foydalanuvchining xatosini tahlil qiladi;
5. barcha variantlarni tekshiradi;
6. tez yechish usulini beradi;
7. oxirida javobsiz o‘xshash savol beradi.

### 3. Chuqur o‘rganish

AI avval bilim bo‘shlig‘ini aniqlaydi, 5 daqiqalik mikro-dars beradi va keyin bir vaqtning o‘zida faqat bitta savol bilan adaptiv mashq olib boradi. Prompt AIga ketma-ket 3 ta mustaqil to‘g‘ri javobdan keyingina mavzuni o‘zlashtirilgan deb hisoblashni buyuradi.

“ChatGPTda ochish” tugmasi promptni clipboardga nusxalab, yangi ChatGPT oynasini ochadi. Shu sababli saytda OpenAI API key saqlash talab qilinmaydi.
