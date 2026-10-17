import { Head, Html, Main, NextScript } from 'next/document';

// Sahifa chizilishidan oldin mavzuni (yorug‘/qorong‘i) qo‘llaydi — miltillash bo‘lmasligi uchun.
const themeScript = `(function(){try{var t=localStorage.getItem('io_theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function Document() {
  return (
    <Html lang="uz">
      <Head>
        <meta name="description" content="Informatika fan olimpiadasi (9–11-sinf, tuman/shahar bosqichi) uchun 16 mavzu, sodda darslar va 800 ta yechimli mashq." />
        <meta name="theme-color" content="#FAF9F5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&display=swap"
        />
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23C96442'/%3E%3Cg stroke='%23FAF9F5' stroke-width='2.6' stroke-linecap='round'%3E%3Cpath d='M16 6v20M6 16h20M9 9l14 14M23 9 9 23'/%3E%3C/g%3E%3C/svg%3E" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
