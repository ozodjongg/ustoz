# Informatika Olimpiada Trainer

2025-yil O‘zbekiston 9-, 10- va 11-sinf Informatika fan olimpiadasi tuman (shahar) bosqichidagi 90 ta test savolining mavzu tahlili asosida tuzilgan **to‘liq statik Next.js** tayyorgarlik sayti.

## Nimalar tayyor

- `unit.json` — 90 original savol uchun sinf, savol raqami, ball, rasmiy javob, mavzu va qisqa mazmun; 17 ta birlashtirilgan unit.
- `public/data/questions/*.json` — har bir unit uchun 100 tadan yangi mashq, jami **1700 ta savol**.
- Har bir mavzu uchun juda sodda, bosqichma-bosqich dars sahifasi.
- Har mavzu sahifasida tasodifiy savol.
- Vaqt va savollar sonini foydalanuvchi o‘zi tanlaydigan sinov.
- Original ball tizimi: 0.9 / 1.5 / 2.6.
- Xato savollar mavzusi `localStorage` ga saqlanadi.
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
