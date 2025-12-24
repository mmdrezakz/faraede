'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Navbar from './components/Navbar';
import IsTyping from './components/IsTyping';
import ScrollGuide from './components/ScrollGuide';
import Image from 'next/image';

export default function GsapDemoPage() {
  const textRef = useRef([]);
  const lampRef = useRef(null);
  const lampGlowRef = useRef(null);

useEffect(() => {
  // انیمیشن متن‌ها
  gsap.fromTo(
    textRef.current,
    {
      opacity: 0,
      y: 40,
      filter: "blur(12px)",
      scale: 0.95,
    },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      duration: 1.6,
      stagger: 0.25,
      ease: "power4.out",
    }
  );

  // ظاهر شدن لامپ بعد از پایان انیمیشن متن‌ها
  gsap.fromTo(
    lampRef.current,
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
      ease: "power3.out",
      delay: 2.2, // ⬅️ این باعث میشه بعد از متن‌ها ظاهر بشه
    }
  );

  // تاب خوردن لامپ (شروع بعد از ظاهر شدن)
  gsap.to(lampRef.current, {
    rotation: 6,
    x: 8,
    duration: 2.4,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
    delay: 1.1, // ⬅️ هماهنگ با ظاهر شدن
  });

  // پالس نور لامپ
  gsap.to(lampGlowRef.current, {
    opacity: 0.55,
    duration: 2,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
    delay: 1.1, // ⬅️ نور هم بعد از ظاهر شدن شروع میشه
  });
}, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col justify-center items-center gap-6 bg-gray-200 text-gray-800">

        {/* هاله نور لامپ */}
        <div
          ref={lampGlowRef}
          className="absolute top-20 w-[260px] h-[260px] rounded-full bg-yellow-200 opacity-40 blur-3xl"
        ></div>

        {/* خود لامپ */}
        <Image
          ref={lampRef}
          src="/2.png"
          width={200}
          height={200}
          alt="lamp"
          className="absolute top-18 z-10"
        />

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