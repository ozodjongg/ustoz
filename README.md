# Informatika Olimpiada Trainer

2024-yil O‘zbekiston **9-, 10- va 11-sinf Informatika** fan olimpiadasi tuman (shahar) bosqichidagi 90 ta savol tahlili asosida tuzilgan, **to‘liq statik** Next.js tayyorgarlik sayti.

## Nimalar bor

- **16 ta mavzu** — 90 ta asl olimpiada savoli mavzularga ajratilgan (`data/topics.json` → `sources`).
- Har bir mavzu uchun **juda sodda tushuntirish sahifasi**: hayotiy o‘xshatish, bosqichma-bosqich bo‘limlar, jadvallar, kod misollari, ishlangan misollar, ko‘p uchraydigan xatolar, «Eslab qol» va lug‘at.
- Har bir mavzu uchun **50 tadan turli savol** — jami **800 ta**, har birida **qadam-baqadam yechim**.
- Savollar qiyinligi olimpiada ball tizimiga mos: **0,9 / 1,7 / 2,4** ball.
- Mavzu bo‘yicha mashq: filtrlar (ball, yechilmagan, xatolarim), savollar xaritasi, natijalar saqlanadi.
- Olimpiada formatidagi **sinov**: 30 savol = 10 × 0,9 + 10 × 1,7 + 10 × 2,4 = 50 ball, vaqt va mavzularni tanlash mumkin, oxirida xatolar tahlili.
- **Xatolar bo‘limi**: xato qilingan savollarni qayta ishlash; to‘g‘ri yechilsa ro‘yxatdan o‘chadi.
- **AI yordamchi**: savol konteksti bilan tayyor prompt (Maslahat / Tushuntir / Chuqur o‘rgan) — Claude yoki ChatGPT’da ochiladi. Maslahat rejimi javobni oshkor qilmaydi.
- Yorug‘ va qorong‘i rejim, mobil qurilmalarga moslashgan dizayn.
- Ixtiyoriy Telegram hisobot (token faqat brauzer `localStorage` ida saqlanadi).

## Mavzular

| № | Mavzu | Asl savollar |
|---|-------|--------------|
| 1 | Sanoq sistemalari | 10 |
| 2 | Kasr va davriy kasrlar sanoq sistemalarida | 3 |
| 3 | Mantiqiy amallar va ifodalar | 5 |
| 4 | Mantiqiy elementlar va sxemalar | 4 |
| 5 | Axborot o‘lchov birliklari | 3 |
| 6 | Axborot hajmi va uzatish tezligi | 6 |
| 7 | Excel: bloklar va katak manzillari | 6 |
| 8 | Excel: formulalar va funksiyalar | 8 |
| 9 | Python asoslari: turlar, operatorlar, satrlar | 11 |
| 10 | Python: list, tuple, set, dict | 8 |
| 11 | Python: sikllar va range | 4 |
| 12 | Python: funksiyalar | 6 |
| 13 | Rekursiya | 3 |
| 14 | Bit amallari | 3 |
| 15 | Algoritmlar va blok-sxemalar | 2 |
| 16 | Kompyuter, dasturiy ta’minot va IT tarixi | 9 |

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
