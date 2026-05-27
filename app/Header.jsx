'use client';
import React from 'react'

import Image from 'next/image';
import Navbar from './components/Navbar';
import ScrollGuide from './components/ScrollGuide';
import { Link as ScrollLink } from 'react-scroll';



export default function Header({session}) {
  return (
        <header className='header-top w-full min-h-screen'>
      <Navbar session={session} />

<section className="relative grid grid-cols-1 lg:grid-cols-3 xs:grid-col-2 mt-3 md:mt-10 lg:mt-4 2xl:mt-50 px-6 py-10 h-auto text-center section1 section2">

  {/* Text */}


  <div data-aos="zoom-out-left" className="my-20 md:my-20 2xl:my-26">
    <h2 className="mt-10 font-bold text-gray-100 text-6xl lg:text-8xl">فرا تر از انتظار</h2>
    <h1 className="text-gray-200 text-4xl md:text-6xl">فرا ایده</h1>
    <h3 className="my-4 text-orange-400 text-xs md:text-sm lg:text-base">
   ارائه‌دهنده خدمات طراحی سایت، سئو و مشاوره دیجیتال مارکتینگ
</h3>
    <button className="bg-gray-400 hover:bg-gray-300 mt-1 px-6 py-3 rounded-full text-gray-900 transition duration-500 cursor-pointer">
      <ScrollLink to="pkg" smooth={true} duration={500}>

      خدمات
      </ScrollLink>
    </button>
  </div>
    

  {/* Image */}
  <div className="flex justify-center lg:col-span-2">

    <Image
      src="/pngwing.com.png"
      width={800}
      height={300}
      alt="طراحی سایت اختصاصی فرا ایده - نمونه کار طراحی سایت"
      className='w-auto h-auto'
      priority  
      />
  </div>

</section>

      <ScrollGuide />
    </header>
  )
}
