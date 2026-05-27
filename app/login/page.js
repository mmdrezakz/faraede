'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import SpinnerBtn from '../components/SpinnerBtn'
import * as z from 'zod'

import WarningIcon from '@mui/icons-material/Warning';
import { Alert, Snackbar } from '@mui/material'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [zError,setZerror] = useState([])
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // ✅ اگر قبلاً لاگین کرده، مستقیم هدایت کن
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      if (session.user.role === 'ADMIN') {
        router.push('/admin-dashboard')
      } else {
        router.push('/user-dashboard')
      }
    }
  }, [status, session, router])


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
    email:z.email("لطفا یک ایمیل معتبر وارد کنید ."),
    password:z.string().min(6,"رمز عبور باید از 6 کاراکتر بییشتر باشد .").max(50,"رمز عبور نمیتواند از 50 کاراکتر بیشتر باشد .")
  })
 
  
  // هندلر ورود با ایمیل و رمز
  async function handleEmailLogin(e) {
    e.preventDefault()
    setError('')
    setZerror([]) // تغییر به آرایه خالی
    setFormLoading(true)
    try{

      ValidationSchema.parse({email:formData.email,password:formData.password})
    }catch(err2){

      if(err2 instanceof z.ZodError){
        setZerror(err2.issues)
        
        
        setFormLoading(false)
        return
      }
    }
    setFormLoading(true)
    try {
      showSnackbar('با موفقیت وارد شدید .')
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false // خودمان هندل می‌کنیم
      })

      if (result?.error) {
        setError('ایمیل یا رمز عبور اشتباه است')
      } else {
        // ورود موفقیت‌آمیز
        router.push('/user-dashboard')
        router.refresh()
      }
    } catch (error) {

      console.error("Login error:", error)
      setError('خطایی در ورود رخ داد')
      
    } finally {
      setFormLoading(false)
      
      
    }
  }

  // هندلر ورود با گوگل
  async function Googlehandler() {
    try {
      setGoogleLoading(true)
      await signIn('google', { callbackUrl: '/' })
      showSnackbar('ورود  با گوگل موفق')

    } catch {

      setGoogleLoading(false)
    }
  }

  // هندلر تغییر input‌ها
  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <main className='register min-h-screen flex justify-center items-center bg-linear-to-b from-[#001122] to-[#001b38]'>
      <form
        onSubmit={handleEmailLogin}
        className='bg-gray-200 flex flex-col justify-center items-center p-5 sm:p-8 md:p-10 gap-5 rounded-2xl shadow-2xl shadow-gray-900 text-gray-500  '
      >
        <h1 className='text-2xl font-bold'>ورود به حساب کاربری</h1>

        {/* نمایش خطا */}
        {error && (
          <div className='w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm'>
            {error}
          </div>
        )}

        {/* ایمیل */}
        <div className='flex items-center justify-center  w-full gap-3'>
          <label className='font-medium w-8 md:w-28 text-xs sm:text-sm md:text-lg '>ایمیل</label>
          <input
          autoComplete="true"
            name="email"
            placeholder='example@email.com'
            value={formData.email}
            onChange={handleInputChange}
            
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
        <div className='flex  items-center justify-center w-full gap-3'>
          <label className='font-medium w-8 md:w-28 text-xs sm:text-sm md:text-lg '>رمز عبور</label>
          <input
          autoComplete="true"
            name="password"
            type='password'
            placeholder='رمز عبور خود را وارد کنید'
            value={formData.password}
            onChange={handleInputChange}
            
            
            className='bg-white px-2 py-1.5 rounded-lg outline-1 hover:outline-2 focus:outline-4 text-xs sm:text-sm md:text-lg'
          />
        </div>
{zError.filter(err => err.path?.[0] === 'password').length > 0 && (
  <p className='bg-red-500 flex justify-center items-center px-4 w-full text-center text-xs py-0.5 rounded-lg text-white'>
    <WarningIcon fontSize='small' sx={{color:"yellow"}}/> 
    {zError.find(err => err.path?.[0] === 'password')?.message}
  </p>
)}
        {/* لینک فراموشی رمز */}
        <div className='flex justify-start w-full'>
          <Link
            href='/forgot-password'
            className='text-orange-500 hover:text-orange-600 text-sm transition'
          >
            رمز عبور را فراموش کرده‌اید؟
          </Link>
        </div>

        <div className='flex gap-3 items-center justify-start w-full'>
          <p className='text-sm sm:text-base'>حساب کاربری ندارید؟</p>
          <Link
            className='bg-orange-400 px-2 py-0.5 rounded-lg shadow-sm hover:shadow-md transition text-white'
            href={'/register'}
            prefetch
          >
            ثبت نام
          </Link>
        </div>

        {/* دکمه ورود با ایمیل */}
        <button
          type='submit'
          disabled={formLoading}
          className='flex hover:cursor-pointer items-center justify-center gap-2 text-white border border-orange-300 bg-orange-500 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition w-full disabled:opacity-50'
        >
          {formLoading ? (
            <div className='flex justify-center gap-2 items-center'>
              <SpinnerBtn size="sm" />
              <span>در حال ورود...</span>
            </div>
          ) : (
            'ورود به حساب'
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
        <div className='relative w-full my-2'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-gray-200 text-gray-500'>یا</span>
          </div>
        </div>

        {/* دکمه ورود با گوگل */}
        <button
          onClick={Googlehandler}
          disabled={googleLoading}
          type='button'
          className='flex hover:cursor-pointer items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition w-full disabled:opacity-70 disabled:cursor-not-allowed'
        >
          {googleLoading ? (
            <div className='flex justify-center gap-2 items-center'>
              <SpinnerBtn size="sm" />
              <span>در حال اتصال...</span>
            </div>
          ) : (
            <>
              <img
                src='https://www.svgrepo.com/show/355037/google.svg'
                alt='Google Logo'
                className='w-5 h-5'
              />
              <span className='text-gray-700 text-sm md:text-base'>ورود با گوگل</span>
            </>
          )}
        </button>
      </form>
    </main>
  )
}