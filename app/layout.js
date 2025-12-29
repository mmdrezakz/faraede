

import { Suspense } from "react";
import "./globals.css";

import { Lalezar } from 'next/font/google'
import Loading from "./loading";


 
const ss = Lalezar({
  subsets: ['latin','arabic'],
  weight: "400",
  preload:true
})

export const metadata = {
  title: "Fara Ede",
  description: "Fara Ede Programmer Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>

      <link
        rel="preload"
        href="/layered.svg"
        as="image"
        type="image/svg+xml"
        />
        </head>
      
      <body className={ss.className}>
<Suspense fallback={<Loading/>}/>
        {children}
      </body>
    </html>
  );
}
