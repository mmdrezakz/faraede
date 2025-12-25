'use client';

import Image from 'next/image';
import Navbar from './components/Navbar';
import ScrollGuide from './components/ScrollGuide';

export default function LandingPage() {
  return (
    <header className='min-h-screen w-full '>
      <Navbar />

{/* Hero Section */}
<section className="relative grid  grid-cols-1 md:grid-cols-3   md:mt-50 section1 text-center section2   h-auto md:h-[65vh] px-6 md:py-10">

  {/* Text */}
  <div className="  my-30">
    <h1 className=" text-6xl lg:text-8xl font-bold mt-10 text-gray-100 ">فرا تر از انتظار</h1>
    <h2 className="text-4xl md:text-6xl  text-gray-200 ">فرا ایده</h2>
    <button className="bg-gray-400 mt-1 text-gray-900 px-6 py-3 rounded-full hover:bg-gray-300 transition duration-500">
      خدمات
    </button>
  </div>

  {/* Image */}
  <div className="  flex justify-center md:col-span-2 ">
    <Image
      src="/pngwing.com.png"
      width={800}
      height={300}
      alt="hero"
      className="object-contain"
    />
  </div>

</section>

      <ScrollGuide />
    </header>
  );
}