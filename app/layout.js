
import "./globals.css";

import { Lalezar } from 'next/font/google'

 
const ss = Lalezar({
  subsets: ['latin'],
  weight: "400"
})

export const metadata = {
  title: "Fara Ede",
  description: "Fara Ede Programmer Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={ss.className}>

        {children}
      </body>
    </html>
  );
}
