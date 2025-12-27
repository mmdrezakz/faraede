'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="top-0 left-0 z-50 relative px-8 py-4 w-full">
      <div className="flex justify-between items-center mx-auto max-w-7xl">
        <div className="flex justify-center items-center gap-2 md:gap-4">
          {/* Logo */}
          <h1 className="bg-gray-200 px-2 py-0.5 rounded-2xl font-extrabold text-gray-950 text-lg md:text-3xl tracking-wide">
            فرا ایده
          </h1>
          <div className="flex justify-between items-end gap-3 rounded-full ring-3 ring-gray-400 w-6 md:w-8 h-6 md:h-8">
            <Image
              className="shadow-2xs shadow-gray-200 rounded-full"
              src={
                'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
              }
              width={100}
              height={100}
              alt="placeholder"
              preload={true}
            />
            <p className="text-gray-200 text-xs sm:text-sm">UserName</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 font-medium text-white text-lg">
          <Link href={'/register'} prefetch>
            <li className="group relative cursor-pointer">
              ثبت نام / ورود
              <span className="bottom-0 left-0 absolute bg-white rounded-full w-0 group-hover:w-full transition-all duration-300"></span>
            </li>
          </Link>
          <Link href={'/team'}>
            <li className="group relative cursor-pointer">
              اعضاء
              <span className="bottom-0 left-0 absolute bg-white rounded-full w-0 group-hover:w-full transition-all duration-300"></span>
            </li>
          </Link>
          <Link href={'/team'}>
            <li className="group relative cursor-pointer">
              نمونه‌کارها
              <span className="bottom-0 left-0 absolute bg-white rounded-full w-0 group-hover:w-full transition-all duration-300"></span>
            </li>
          </Link>
          <Link href={'/team'}>
            <li className="group relative cursor-pointer">
              خانه
              <span className="bottom-0 left-0 absolute bg-white rounded-full w-0 group-hover:w-full transition-all duration-300"></span>
            </li>
          </Link>
        </ul>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden text-white text-3xl cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="white"
              className="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="33"
              height="33"
              fill="white"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
            </svg>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 bg-gray-900/95 bg-opacity-95 shadow-xl mt-4 p-5 rounded-xl min-h-[83vh] text-white text-lg">
          <Link href={'/'}>
            <button className="text-right">خانه</button>
          </Link>
          <Link href={'/register'} prefetch>
            <button className="text-right">ثبت نام / ورود</button>
          </Link>
          <button className="text-right">اعضاء</button>
          <button className="text-right">خدمات</button>
          <button className="text-right">نمونه‌کارها</button>
          <button className="text-right">تماس</button>
        </div>
      )}
    </nav>
  );
}