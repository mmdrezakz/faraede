'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Navbar from './components/Navbar';
import IsTyping from './components/IsTyping';
import ScrollGuide from './components/ScrollGuide';
import Image from 'next/image';

export default function GsapDemoPage() {
  const textRef = useRef([]);
  const lampWrapperRef = useRef(null);
  const lampGlowRef = useRef(null);

  useEffect(() => {
    // انیمیشن ورود متن‌ها
    gsap.fromTo(
      textRef.current,
      {
        opacity: 0,
        y: 40,
        filter: 'blur(12px)',
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        duration: 1.6,
        stagger: 0.25,
        ease: 'power4.out',
      }
    );

    // ظاهر شدن لامپ بعد از متن‌ها
    gsap.fromTo(
      lampWrapperRef.current,
      {
        opacity: 0,
        scale: 0.8,
        y: -20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 2.2,
      }
    );

    // تاب خوردن لامپ
    gsap.to(lampWrapperRef.current, {
      rotation: 6,
      x: 8,
      duration: 2.4,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2.2,
    });

    // پالس نور لامپ
    gsap.fromTo(
      lampGlowRef.current,
      { opacity: 0 },
      {
        opacity: 0.55,
        duration: 4,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.2,
      }
    );
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col justify-center items-center gap-6  bg-linear-to-r from-gray-400 via-gray-100 to-gray-400 text-gray-800">

        {/* هاله نور */}
        <div
          ref={lampGlowRef}
          className="absolute top-20 w-[260px] h-[260px] rounded-full bg-yellow-200 opacity-0 blur-3xl"
        ></div>

        {/* لامپ داخل یک wrapper برای ref */}
        <div ref={lampWrapperRef} className="absolute top-18 z-10 opacity-0">
          <Image src="/2.png" width={200} height={200} alt="lamp" />
        </div>

        {/* متن‌ها */}
        {['فرا ایده', 'تیم طراحی و توسعه وب اپلیکیشن'].map((txt, i) => (
          <h1
            key={i}
            ref={(el) => (textRef.current[i] = el)}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold"
          >
            {txt}
          </h1>
        ))}

        <IsTyping />
      </div>

      <ScrollGuide />
    </>
  );
}