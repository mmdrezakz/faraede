'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ScrollGuide() {
  const arrowRef = useRef(null);

  useEffect(() => {
    // انیمیشن بالا پایین شدن فلش
    gsap.to(arrowRef.current, {
      y: 15,
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: "power1.inOut",
    });
  }, []);

  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="bottom-6 left-1/2 z-50 fixed -translate-x-1/2">
      <button
        onClick={handleScroll}
        className="flex flex-col items-center text-gray-700 hover:text-gray-900"
      >
        <span className="mb-2 text-sm">اسکرول کنید</span>

        <svg
          ref={arrowRef}
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}