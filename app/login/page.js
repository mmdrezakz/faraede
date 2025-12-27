'use client'
import React from 'react'
import './login.css'
import Link from 'next/link'

export default function Page() {
  return (
    <main className='register min-h-screen flex justify-center items-center'>
      <form
        className='bg-gray-200 flex flex-col justify-center items-center p-5 sm:p-8 md:p-10 gap-5 rounded-2xl shadow-2xl shadow-gray-900 text-gray-500'
      >
        <h1 className='text-2xl'>ورود</h1>

        {/* ایمیل */}
        <div className='flex items-center gap-3'>
          <label className='w-12 md:w-28 text-xs sm:text-sm md:text-lg'>ایمیل</label>
          <input
            type='text'
            placeholder='ایمیل'
            className='bg-white px-2 py-1.5 rounded-lg outline-1 hover:outline-2 focus:outline-4 text-xs sm:text-sm md:text-lg'
          />
        </div>

        {/* پسورد */}
        <div className='flex items-center gap-3'>
          <label className='w-12 md:w-28 text-xs sm:text-sm md:text-lg'>پسورد</label>
          <input
            type='password'
            placeholder='پسورد'
            className='bg-white px-2 py-1.5 rounded-lg outline-1 hover:outline-2 focus:outline-4 text-xs sm:text-sm md:text-lg'
          />
        </div>

        <div className='flex gap-3 items-center justify-start w-full'>
          <p className='text-xs sm:text-sm'>قبلا ثبت نام نکرده ام </p>
          <Link
            className='bg-orange-400 px-2 py-0.5 rounded-lg shadow-sm hover:shadow-md transition text-white'
            href={'/register'}
          >
            ثبت نام
          </Link>
        </div>

        {/* دکمه ورود */}
        <button
          type='button'
          className='flex hover:cursor-pointer items-center justify-center gap-2 text-white border border-orange-300 bg-orange-500 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition w-full'
        >
          ورود
        </button>

        {/* دکمه ورود با گوگل */}
        <button
          type='button'
          className='flex hover:cursor-pointer items-center justify-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition w-full'
        >
          <img
            src='https://www.svgrepo.com/show/355037/google.svg'
            alt='Google Logo'
            className='w-5 h-5'
          />
          <span className='text-gray-700 text-sm md:text-base'>ثبت نام با گوگل</span>
        </button>
      </form>
    </main>
  )
}