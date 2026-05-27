'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import SpinnerBtn from '../components/SpinnerBtn'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    
    if (!email) {
      setError('لطفا ایمیل خود را وارد کنید')
      return
    }

    setLoading(true)

    try {
      // ارسال درخواست به API
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('لینک بازیابی رمز عبور به ایمیل شما ارسال شد')
        setEmail('')
      } else {
        setError(data.error || 'خطایی رخ داده است')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('خطا در ارتباط با سرور')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen flex justify-center items-center bg-linear-to-b from-[#001122] to-[#001b38]'>
      <div className='bg-gray-200 flex flex-col justify-center items-center p-5 sm:p-8 md:p-10 gap-5 rounded-2xl shadow-2xl shadow-gray-900 text-gray-500  max-w-[80%]'>
        <h1 className='text-2xl font-bold'>بازیابی رمز عبور</h1>
        
        <p className='text-sm text-center text-gray-600'>
          ایمیل خود را وارد کنید. لینک بازیابی رمز عبور برای شما ارسال خواهد شد.
        </p>

        {/* نمایش پیام موفقیت */}
        {message && (
          <div className='w-full p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm'>
            {message}
          </div>
        )}

        {/* نمایش خطا */}
        {error && (
          <div className='w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
          {/* ایمیل */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm sm:text-base font-medium'>ایمیل</label>
            <input
              type='email'
              placeholder='example@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='bg-white px-4 py-3 rounded-lg outline-1 border hover:outline-2 focus:outline-4  text-sm sm:text-base'
            />
          </div>

          {/* دکمه ارسال */}
          <button
            type='submit'
            disabled={loading}
            className='flex hover:cursor-pointer items-center justify-center gap-2 text-white bg-orange-500 hover:bg-orange-600 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition w-full disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {loading ? (
              <div className='flex justify-center gap-2 items-center'>
                <SpinnerBtn size="sm" />
                <span>در حال ارسال...</span>
              </div>
            ) : (
              'ارسال لینک بازیابی'
            )}
          </button>
        </form>

        {/* لینک بازگشت */}
        <div className='flex gap-3 items-center justify-center w-full mt-4'>
          <Link
            href='/login'
            className='text-orange-500 hover:text-orange-600 text-sm sm:text-base transition underline'
          >
            بازگشت به صفحه ورود
          </Link>
        </div>
      </div>
    </main>
  )
}