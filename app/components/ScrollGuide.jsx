'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function ScrollGuide() {
  const arrowRef = useRef(null);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    // انیمیشن بالا پایین شدن فلش
    gsap.to(arrowRef.current, {
      y: 15,
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: "power1.inOut",
    });

    // لیسنر برای اسکرول
    const handleScrollCheck = () => {
      if (window.scrollY === 0) {
        setIsTop(true);
      } else {
        setIsTop(false);
      }
    };

    window.addEventListener("scroll", handleScrollCheck);
    return () => window.removeEventListener("scroll", handleScrollCheck);
  }, []);

  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  // فقط وقتی بالای صفحه هست نمایش بده
  if (!isTop) return null;

  return (
    <div className="bottom-6 left-1/2 z-50 fixed -translate-x-1/2">
      <button
        onClick={handleScroll}
        className="flex flex-col items-center text-gray-200 hover:text-gray-50"
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