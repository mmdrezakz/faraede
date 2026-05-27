

import { Lalezar } from 'next/font/google'
import { SessionProvider } from 'next-auth/react' // اضافه کردن SessionProvider
import Footer from '../components/Footer'

const ss = Lalezar({
  subsets: ['latin', 'arabic'],
  weight: "400",
  preload: true
})

export const metadata = {
  title: "Fara Ede",
  description: "Fara Ede Programmer Team",
}

export default function RootLayout({ children }) {
  return (


      <main className={ss.className}>
        {children}
        <Footer />
      </main>

  )
}