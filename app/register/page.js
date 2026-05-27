'use client'
import React, { useEffect, useState } from 'react'
import { signIn, useSession } from "next-auth/react"
import Link from 'next/link'
import SpinnerBtn from '../components/SpinnerBtn'
import { useRouter } from 'next/navigation'
import WarningIcon from '@mui/icons-material/Warning';

import z from 'zod'
import { Alert, Snackbar } from '@mui/material'


export default function Page() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  })
  const [googleLoading, setGoogleLoading] = useState(false)
  const [credentialsLoading, setCredentialsLoading] = useState(false)
  const [error, setError] = useState('')
    const [zError,setZerror] = useState([])
  const { data: session, status } = useSession()
  const router = useRouter()


    // ✅ state برای Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // ✅ باز کردن Snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // ✅ بستن Snackbar
  const handleCloseSnackbar = (event, reason) => {
    
    setSnackbar({ ...snackbar, open: false });
  };

    //ValidationSchema  
  const ValidationSchema = z.object({
    fullname: z.string().min(4,"اسم و فامیل کامل خود را وارد نمایید .").max(50,"در این فیلد نباید کاراکتر ها از 50 تا بیش تر باشند."),
    username:z.string().min(3,"نام کاربری باید حداقل 3 کاراکتر باشد.").max(50,"در این فیلد نباید کاراکتر ها از 50 تا بیش تر باشند."),
    email:z.email("لطفا یک ایمیل معتبر وارد کنید ."),
    password:z.string().min(6,"رمز عبور باید از 6 کاراکتر بییشتر باشد .").max(50,"رمز عبور نمیتواند از 50 کاراکتر بیشتر باشد .")
  })
 
  // وقتی session عوض شد، redirect کن
  useEffect(() => {
    if (session) {
      router.push('/user-dashboard')
    }
  }, [session, router])

  // ثبت‌نام با Credentials (ایمیل/پسورد)
  async function handleCredentialsSubmit(e) {
    e.preventDefault()
    setCredentialsLoading(true)
    setZerror([])
    setError('')
    try{


            //ValidationSchema Parse
            ValidationSchema.parse({fullname:formData.name,username:formData.username,email:formData.email,password:formData.password})
    }catch(err2){
            if(err2 instanceof z.ZodError){
              setZerror(err2.issues)
              return
      }
    }finally{
      setCredentialsLoading(false)
    }
    

    try {
setCredentialsLoading(true)
      // ارسال به API register
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // ✅ C بزرگ
        body: JSON.stringify(formData)
      })
      showSnackbar('ثبت نام موفق با ایمیل .')
      
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'خطا در ثبت‌نام')
      }

      // بعد از ثبت‌نام موفق، کاربر رو لاگین کن
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }
    // 3. کمی صبر کن session ست بشه
    await new Promise(resolve => setTimeout(resolve, 2000))
      // هدایت به صفحه اصلی
      
      return

    } catch (err) {
      setError(err.message || 'خطا در ثبت‌نام')
      console.error('Registration error:', err)
    } finally {
      setCredentialsLoading(false)
    }
  }

  // ثبت‌نام با گوگل
  async function Googlehandler() {
    try {
      setGoogleLoading(true)
      await signIn('google', { redirectTo: "/" })
      showSnackbar('ثبت نام با گوگل موفق')
    } catch {
      console.log("error to login")
      setGoogleLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className='register min-h-screen flex justify-center items-center bg-linear-to-b from-[#001122] to-[#001b38]'>
      <form
        onSubmit={handleCredentialsSubmit}
        className='bg-gray-200 flex flex-col justify-center items-center p-5 sm:p-8 md:p-10 gap-5 rounded-2xl shadow-2xl shadow-gray-900 text-gray-500'
      >
        <h1 className='text-2xl'>ثبت نام</h1>

        {error && (
          <div className='bg-red-100 text-red-700 p-3 rounded-lg w-full text-sm'>
            {error}
          </div>
        )}

        {/* نام و نام خانوادگی */}
        <div className='flex items-center gap-3'>
          <label className='w-12 md:w-28 text-xs sm:text-sm md:text-lg'>نام و نام خانوادگی</label>
          <input
          autoComplete="true"
            type='text'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            placeholder='نام و نام خانوادگی'
            className='bg-white px-2 py-1.5 rounded-lg outline-1 hover:outline-2 focus:outline-4 text-xs sm:text-sm md:text-lg'
            
          />
        </div>
        {zError.filter(err => err.path?.[0] === 'fullname').length > 0 && (
  <p className='bg-red-500 flex justify-center items-center px-4 w-full text-center text-xs py-0.5 rounded-lg text-white'>
    <WarningIcon fontSize='small' sx={{color:"yellow"}}/> 

    {zError.find(err => err.path?.[0] === 'fullname')?.message}
  </p>
)}

        {/* نام کاربری */}
        <div className='flex items-center gap-3'>
          <label className='w-12 md:w-28 text-xs sm:text-sm md:text-lg'>نام کاربری</label>
          <input
          autoComplete="true"
            type='text'
            name='username'
            value={formData.username}
            onChange={handleInputChange}
            placeholder='نام کاربری'
            className='bg-white px-2 py-1.5 rounded-lg outline-1 hover:outline-2 focus:outline-4 text-xs sm:text-sm md:text-lg'
            
          />
        </div>
        {zError.filter(err => err.path?.[0] === 'username').length > 0 && (
  <p className='bg-red-500 flex justify-center items-center px-4 w-full text-center text-xs py-0.5 rounded-lg text-white'>
    <WarningIcon fontSize='small' sx={{color:"yellow"}}/> 

    {zError.find(err => err.path?.[0] === 'username')?.message}
  </p>
)}
        {/* ایمیل */}
        <div className='flex items-center gap-3'>
          <label className='w-12 md:w-28 text-xs sm:text-sm md:text-lg'>ایمیل</label>
          <input
          autoComplete="true"
            type='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            placeholder='ایمیل'
            className='bg-white px-2 py-1.5 rounded-lg outline-1 hover:outline-2 focus:outline-4 text-xs sm:text-sm md:text-lg'
            
          />
        </div>
        {zError.filter(err => err.path?.[0] === 'email').length > 0 && (
  <p className='bg-red-500 flex justify-center items-center px-4 w-full text-center text-xs py-0.5 rounded-lg text-white'>
    <WarningIcon fontSize='small' sx={{color:"yellow"}}/> 

    {zError.find(err => err.path?.[0] === 'email')?.message}
  </p>
)}
        {/* پسورد */}
        <div className='flex items-center gap-3'>
          <label className='w-12 md:w-28 text-xs sm:text-sm md:text-lg'>رمز عبور</label>
          <input
          autoComplete="true"
            type='password'
            name='password'
            value={formData.password}
            onChange={handleInputChange}
            placeholder='رمز عبور'
            className='bg-white px-2 py-1.5 rounded-lg outline-1 hover:outline-2 focus:outline-4 text-xs sm:text-sm md:text-lg'
            
            minLength={6}
          />
        </div>
                {zError.filter(err => err.path?.[0] === 'password').length > 0 && (
  <p className='bg-red-500 flex justify-center items-center px-4 w-full text-center text-xs py-0.5 rounded-lg text-white'>
    <WarningIcon fontSize='small' sx={{color:"yellow"}}/> 

    {zError.find(err => err.path?.[0] === 'password')?.message}
  </p>
)}

        <div className='flex gap-3 items-center justify-start w-full'>
          <p className='text-xs sm:text-sm'>قبلا ثبت نام کرده ام </p>
          <Link
            className='bg-orange-400 px-2 py-0.5 rounded-lg shadow-sm hover:shadow-md transition text-white'
            href={'/login'}
            prefetch
          >
            ورود
          </Link>
        </div>

        {/* دکمه ثبت نام با ایمیل */}
        <button
          type='submit'
          disabled={credentialsLoading}
          className='flex hover:cursor-pointer items-center justify-center gap-2 text-white border border-orange-300 bg-orange-500 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition w-full disabled:opacity-50'
        >
          {credentialsLoading ? (
            <SpinnerBtn>در حال ثبت‌نام...</SpinnerBtn>
          ) : (
            'ثبت نام'
          )}
        </button>
      {/* ✅ Snackbar وسط صفحه بالا */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        sx={{
          '& .MuiSnackbar-root': {
            top: '80px !important', // فاصله از بالای صفحه
          },
          '& .MuiPaper-root': {
            borderRadius: '14px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            minWidth: '260px',
            maxWidth: '400px',
            display:"flex",
            alignItems:"center",
            gap:"10px"
          }
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            direction: 'rtl',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            fontWeight: 500,
            alignItems: 'center',
            '& .MuiAlert-message': {
              padding: '8px 0',
              textAlign: 'center',
              flex: 1
            },
            '& .MuiAlert-icon': {
              marginRight: '0',
              marginLeft: '12px'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
        {/* جداکننده */}
        <div className='flex items-center w-full my-2'>
          <div className='grow border-t border-gray-400'></div>
          <span className='px-3 text-gray-500 text-sm'>یا</span>
          <div className='grow border-t border-gray-400'></div>
        </div>

        {/* دکمه ثبت نام با گوگل */}
        <button
          onClick={Googlehandler}
          disabled={googleLoading}
          type='button'
          className='flex hover:cursor-pointer items-center justify-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition w-full disabled:opacity-50'
        >
          {googleLoading ? (
            <div className='flex justify-center gap-4 items-center'>
              <SpinnerBtn>درحال ورود</SpinnerBtn>
            </div>
          ) : (
            <>
              <img
                src='https://www.svgrepo.com/show/355037/google.svg'
                alt='Google Logo'
                className='w-5 h-5'
              />
              <span className='text-gray-700 text-sm md:text-base'>ثبت نام با گوگل</span>
            </>
          )}
        </button>
      </form>
    </main>
  )
}