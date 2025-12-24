'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';


export default function Navbar() {
  const navRef = useRef(null);
  const itemsRef = useRef([]);
  const mobileMenuRef = useRef(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    // انیمیشن ورود نوبار
    gsap.from(navRef.current, {
      y: -40,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    });

    // انیمیشن آیتم‌های دسکتاپ
    gsap.from(itemsRef.current, {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.3,
    });
  }, []);

  // انیمیشن باز شدن منوی موبایل
  useEffect(() => {
    if (open) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        }
      );
    }
  }, [open]);

  return (
    <nav
      ref={navRef}
      className="top-0 left-0 z-50 relative bg-linear-to-r from-gray-950 via-gray-900 to-gray-950 bg-opacity-90 shadow-gray-600 shadow-lg backdrop-blur-xl px-8 py-4 w-full"
    >

      <div className="flex justify-between items-center mx-auto max-w-7xl">
        {/* Logo */}
        <h1
          ref={(el) => (itemsRef.current[0] = el)}
          className="bg-gray-200 px-2 py-0.5 rounded-2xl font-extrabold text-gray-950 text-3xl tracking-wide"
        >
          فرا ایده
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 font-medium text-white text-lg">
          {["خانه", "خدمات", "نمونه‌کارها", "تماس"].map((item, i) => (
            <li
              key={i}
              ref={(el) => (itemsRef.current[i + 1] = el)}
              className="group relative cursor-pointer"
            >
              {item}
              <span className="bottom-0 left-0 absolute bg-white rounded-full w-0 group-hover:w-full transition-all duration-300"></span>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Icon */}
        <div
          ref={(el) => (itemsRef.current[5] = el)}
          className="md:hidden text-white text-3xl cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          ☰
        </div>
      </div>
            

      {/* Mobile Menu */}
      {open && (
        <div
          ref={mobileMenuRef}
          className="md:hidden flex flex-col gap-4 bg-gray-900/95 bg-opacity-95 shadow-xl mt-4 p-5 rounded-xl text-white text-lg"
        >
          <button className="text-right">خانه</button>
          <button className="text-right">خدمات</button>
          <button className="text-right">نمونه‌کارها</button>
          <button className="text-right">تماس</button>
        </div>
      )}
    </nav>
  );
}