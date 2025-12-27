'use client';
import React from 'react'

import Image from 'next/image';
import Navbar from './components/Navbar';
import ScrollGuide from './components/ScrollGuide';



export default function Header() {
  return (
        <header className='header-top w-full min-h-screen'>
      <Navbar />

{/* Hero Section */}
<section className="relative grid grid-cols-1 md:grid-cols-3 md:mt-50 px-6 py-10 h-auto text-center section1 section2">

  {/* Text */}
  <div className="my-15 2xl:my-30">
    <h1 className="mt-10 font-bold text-gray-100 text-6xl lg:text-8xl">فرا تر از انتظار</h1>
    <h2 className="text-gray-200 text-4xl md:text-6xl">فرا ایده</h2>
    <button className="bg-gray-400 hover:bg-gray-300 mt-1 px-6 py-3 rounded-full text-gray-900 transition duration-500">
      خدمات
    </button>
  </div>

  {/* Image */}
  <div className="flex justify-center md:col-span-2">

    <Image
      src="/pngwing.com.png"
      width={800}
      height={300}
      alt="hero"
      className="object-contain"
      loading='eager'
    />
  </div>

</section>

      <ScrollGuide />
    </header>
  )
}
