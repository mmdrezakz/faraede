import "./globals.css";
import { Lalezar } from 'next/font/google'
import { SessionProvider } from "next-auth/react";
import { auth } from "../auth";
import Script from 'next/script'


const ss = Lalezar({
  subsets: ['latin', 'arabic'],
  weight: "400",
  preload: true
})

export const metadata = {
  title: "فرا ایده | طراحی سایت اختصاصی",
  description: "سفارش سایت اختصاصی با طراحی منحصر به فرد و ارزان قیمت و پشتیبانی 24 ساعته",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="fa" dir="rtl">
      <head>
        <title>فراایده</title>
        <meta name="google-site-verification" content="vowZS5twhGbzwww2Elk_wSglexOXbieaI-FLJxQcNfE" />
        <meta name="description" content="فراایده طراحی سایت" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/1-removebg-preview (1).png" />
        <link rel="manifest" href="/favicon/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/favicon/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />

        <meta property="og:url" content="https://faraede.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="فرا ایده | طراحی سایت اختصاصی" />
        <meta property="og:description" content="سفارش سایت اختصاصی با طراحی منحصر به فرد و ارزان قیمت و پشتیبانی 24 ساعته" />
        <meta property="og:image" content="https://i.ibb.co/spMTJgrk/faraidea.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="faraede.vercel.app" />
        <meta property="twitter:url" content="https://faraede.vercel.app/" />
        <meta name="twitter:title" content="فرا ایده | طراحی سایت اختصاصی" />
        <meta name="twitter:description" content="سفارش سایت اختصاصی با طراحی منحصر به فرد و ارزان قیمت و پشتیبانی 24 ساعته" />
        <meta name="twitter:image" content="https://i.ibb.co/spMTJgrk/faraidea.png" />

        <link rel="preload" href="/layered.svg" as="image" type="image/svg+xml" />
      </head>
      
      <body className={`${ss.className} `}>
        <SessionProvider session={session}>
          {children}
       <Script
   id="muchat-agent"
   type="module"
   dangerouslySetInnerHTML={{
   __html: `import Chatbox from 'https://cdn.mu.chat/embeds/dist/chatbox/index.js?v=2';
             
   Chatbox.initBubble({
   agentId: 'cmlx4cu1w00zel7e9hjyoozwk',
      });`
     }}
   />
        </SessionProvider>


      </body>
    </html>
  );
}