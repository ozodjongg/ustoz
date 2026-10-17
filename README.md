# Informatika Olimpiada Trainer

O‘zbekiston **9-, 10- va 11-sinf Informatika** fan olimpiadasi tuman (shahar) bosqichining **2024-yil** va **2025–2026 o‘quv yili** savollari (jami 180 ta) tahlili asosida tuzilgan, **to‘liq statik** Next.js tayyorgarlik sayti.

## Nimalar bor

- **22 ta mavzu** — 180 ta asl olimpiada savoli mavzularga ajratilgan (`data/topics.json` → `sources`, yili va sinfi bilan).
- Har bir mavzu uchun **juda sodda tushuntirish sahifasi**: hayotiy o‘xshatish, bosqichma-bosqich bo‘limlar, jadvallar, kod misollari, ishlangan misollar, ko‘p uchraydigan xatolar, «Eslab qol» va lug‘at.
- Har bir mavzu uchun **50 tadan turli savol** — jami **1100 ta**, har birida **qadam-baqadam yechim**.
- Savollar qiyinligi olimpiada ball tizimiga mos: **0,9 / 1,5 / 2,6** ball (2025–2026 o‘quv yili tizimi).
- Mavzu bo‘yicha mashq: filtrlar (ball, yechilmagan, xatolarim), savollar xaritasi, natijalar saqlanadi.
- Olimpiada formatidagi **sinov**: 30 savol = 10 × 0,9 + 10 × 1,5 + 10 × 2,6 = 50 ball, vaqt va mavzularni tanlash mumkin, oxirida xatolar tahlili.
- **Xatolar bo‘limi**: xato qilingan savollarni qayta ishlash; to‘g‘ri yechilsa ro‘yxatdan o‘chadi.
- **AI yordamchi**: savol konteksti bilan tayyor prompt (Maslahat / Tushuntir / Chuqur o‘rgan) — Claude yoki ChatGPT’da ochiladi. Maslahat rejimi javobni oshkor qilmaydi.
- Yorug‘ va qorong‘i rejim, mobil qurilmalarga moslashgan dizayn.
- Ixtiyoriy Telegram hisobot (token faqat brauzer `localStorage` ida saqlanadi).

## Mavzular

| № | Mavzu | 2024 savollari | 2025–2026 savollari |
|---|-------|----|----|
| 1 | Sanoq sistemalari | 10 | 3 |
| 2 | Kasr va davriy kasrlar sanoq sistemalarida | 3 | 3 |
| 3 | Axborot o‘lchov birliklari | 3 | 2 |
| 4 | Axborot hajmi va uzatish tezligi | 6 | 12 |
| 5 | Kodlash: ASCII, RGB va HEX | 0 | 4 |
| 6 | Mantiqiy amallar va ifodalar | 5 | 3 |
| 7 | Mantiqiy elementlar va sxemalar | 4 | 3 |
| 8 | Bit amallari | 3 | 1 |
| 9 | Algoritmlar va blok-sxemalar | 2 | 6 |
| 10 | Python asoslari: turlar, operatorlar, satrlar | 11 | 0 |
| 11 | Python: list, tuple, set, dict | 8 | 3 |
| 12 | Python: sikllar va range | 4 | 5 |
| 13 | Python: funksiyalar | 6 | 1 |
| 14 | Rekursiya | 3 | 0 |
| 15 | Excel: bloklar va katak manzillari | 6 | 0 |
| 16 | Excel: formulalar va funksiyalar | 8 | 6 |
| 17 | Ma’lumotlar bazasi: Access va SQL | 0 | 9 |
| 18 | Fayllar: maskalar va kengaytmalar | 0 | 5 |
| 19 | Tarmoq va Internet | 0 | 8 |
| 20 | Shifrlash: Sezar va Vigenère | 0 | 3 |
| 21 | Modellashtirish | 0 | 3 |
| 22 | Kompyuter, dasturiy ta’minot va IT tarixi | 9 | 10 |

## Tuzilma

```
data/topics.json               mavzular, darslar, asl savollar manbasi, AI konteksti
public/data/questions/*.json   har bir mavzu uchun 50 ta savol (yechimlari bilan)
scripts/validate-data.mjs      savol banklari yaxlitligini tekshirish
pages/                         bosh sahifa, dars, mashq, sinov, xatolar, sozlamalar
components/                    savol kartasi, dars ko‘rinishi, AI yordamchi
```

Savollar **statik JSON** fayllarda saqlanadi — build vaqtida hech narsa generatsiya qilinmaydi. Savolni tahrirlash uchun tegishli `public/data/questions/<mavzu>.json` faylini o‘zgartiring:

```json
{
  "id": "rekursiya-01",
  "unit": "rekursiya",
  "difficulty": "easy",
  "points": 0.9,
  "prompt": "Quyidagi kod natijasini toping:",
  "code": "def f(n): ...",
  "options": ["…", "…", "…", "…"],
  "answer": 3,
  "explanation": "Qisqa izoh",
  "solution": ["1-qadam", "2-qadam", "Natija: …"]
}
```

So‘ng tekshiring: `npm run validate`.

## Ishga tushirish

```bash
npm install
npm run dev        # ishlab chiqish rejimi
npm run validate   # savol banklarini tekshirish
npm run build      # statik sayt → out/
```

`next.config.mjs` ichida `output: 'export'` — natija `out/` papkasiga chiqadi va istalgan statik hostingga joylanadi.

## Telegram xavfsizligi

Backend yo‘qligi sababli bot tokeni faqat admin/o‘qituvchi brauzerining `localStorage` xotirasida saqlanadi. Tokenni kodga yoki `NEXT_PUBLIC_*` o‘zgaruvchiga yozmang. Ommaviy deploymentda tokenni yashirish uchun kichik serverless proxy kerak bo‘ladi.
