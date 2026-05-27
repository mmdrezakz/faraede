'use client';

import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import CardNavbar from './CardNavbar';
import { user } from '@heroui/react';
import { Alert, Snackbar } from '@mui/material';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const pathName = usePathname();
    const isHome = pathName === '/'
    const {data : session} = useSession()
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
      const handleLogout = async () => {
    await signOut({
      redirectTo: "/",
      redirect: true,
    })
    showSnackbar('خروج با موفقیت انجام شد .')
  }
    const displayName = () =>{
        if(!session?.user) return null

         // اولویت: نام کامل -> نام کاربری -> ایمیل
         return session.user.name

    }

    return (
        <nav className="top-0 left-0 z-50 relative px-8 py-4 w-full">
            <div className="flex justify-between items-center mx-auto max-w-7xl">
                <div className="flex justify-center items-center gap-2 md:gap-4">

                    {/* Logo */}
                    <h1
                        className="bg-gray-200 rounded-2xl font-extrabold text-gray-950 text-lg md:text-3xl tracking-wide">
                            <Link href={"/"} >
                              <Image src={"/favicon/1mmd.png"} width={50} height={30} alt='icon_faraede'/>
                            </Link>
                    </h1>
                    <CardNavbar/>

                    {session?.user && (

                    <>
                                        <div
                        className="flex justify-between items-end gap-3 rounded-full ring-3 ring-gray-400 w-6 md:w-8 h-6 md:h-8">
                        <Link href={'/user-dashboard'}>
<Image
  className="shadow-2xs shadow-gray-200 rounded-full"
  src={user?.id 
    ? `/api/user-avatar/${user.id}` 
    : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  }
  width={100}
  height={100}
  alt="placeholder"
/>
                            </Link>
                    </div>
                        <Link href={'/user-dashboard'}>
                        <p className="text-gray-200 text-xs sm:text-sm">{displayName()}</p>
                            </Link>
                        </>
                    )}
                </div>
                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-8 font-medium text-white text-lg">
                    {session?.user ? (
                      <>
                        <button className='hover:' onClick={handleLogout}>
                        <li className="group relative cursor-pointer">
                            خروج
                            <span
                                className="bottom-0 left-0 absolute bg-[#0066ff] rounded-full w-0 group-hover:w-full h-0.5 transition-all duration-300"></span>
                        </li>
                    </button>
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
                          </>
                    ) :(
                                            <Link className='hover:' href={'/register'} >
                        <li className="group relative cursor-pointer">
                            ثبت نام / ورود
                            <span
                                className="bottom-0 left-0 absolute bg-[#0066ff] rounded-full w-0 group-hover:w-full h-0.5 transition-all duration-300"></span>
                        </li>
                    </Link>
                    )}

                    {isHome && (<>
                    
                    <ScrollLink to="team" smooth={true} duration={500}>

                        <li className="group relative cursor-pointer">
                            اعضاء
                            <span
                                className="bottom-0 left-0 absolute bg-[#0066ff] rounded-full w-0 group-hover:w-full h-0.5 transition-all duration-300"></span>
                        </li>
                    </ScrollLink>
                    
                    <ScrollLink to="work" smooth={true} duration={500}>


                        <li className="group relative cursor-pointer">
                            نمونه‌کارها
                            <span
                                className="bottom-0 left-0 absolute bg-[#0066ff] rounded-full w-0 group-hover:w-full h-0.5 transition-all duration-300"></span>
                        </li>
                    </ScrollLink>
                    </>)}
                    
                                        <Link href={'/packages'}>
                        <li className="group relative cursor-pointer">
                            پکیج ها
                            <span
                                className="bottom-0 left-0 absolute bg-[#0066ff] rounded-full w-0 group-hover:w-full h-0.5 transition-all duration-300"></span>
                        </li>
                    </Link>
                    <Link href={'/'}>
                        <li className="group relative cursor-pointer">
                            خانه
                            <span
                                className="bottom-0 left-0 absolute bg-[#0066ff] rounded-full w-0 group-hover:w-full h-0.5 transition-all duration-300"></span>
                        </li>
                    </Link>
                </ul>

                {/* Mobile Menu Icon */}
                <div
                    className="md:hidden text-white text-3xl cursor-pointer"
                    onClick={() => setOpen(!open)}>
                    {
                        open
                            ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    fill="white"
                                    className="bi bi-x-lg"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                </svg>
                            )
                            : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="33"
                                    height="33"
                                    fill="white"
                                    className="bi bi-list"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                                </svg>
                            )
                    }
                </div>
            </div>

            {/* Mobile Menu */}
{open && (
  <>
    {/* Overlay */}
    <div
      className="z-40 fixed inset-0 bg-black/50"
      onClick={() => setOpen(false)}
    />

    {/* Mobile Menu */}
    <div className="md:hidden z-50 fixed inset-x-0 flex flex-col gap-4 bg-gray-900 shadow-[#1a253d] shadow-2xs mx-10 mt-4 p-5 rounded-xl text-white text-lg">
      
      {/* دکمه کلوز */}
      <button
        onClick={() => setOpen(false)}
        className="top-0 left-5 absolute self-end mt-4 mb-2 text-white text-2xl cursor-pointer"
      >
        ✕
      </button>

      <Link href={'/'} className='' onClick={() => setOpen(false)} >
        <button className="text-right cursor-pointer">خانه</button>

                        
      </Link>
                                              <Link href={'/packages'}>
                       
                            پکیج ها
                            <span
                                className="bottom-0 left-0 absolute bg-[#0066ff] rounded-full w-0 group-hover:w-full h-0.5 transition-all duration-300"></span>
                        
                    </Link>
      {!session?.user ? (
        <Link href={'/register'} className=' ' onClick={() => setOpen(false)} >
        <button className="text-right cursor-pointer">ثبت نام / ورود</button>
        </Link>
        ) : (

        <button className="text-right cursor-pointer" onClick={() => signOut({redirectTo:'/',redirect:true} )}>خروج</button>
        )}
      {isHome && (<>
      
                    <ScrollLink to="team" smooth={true} duration={500} onClick={() => setOpen(false)}>

      <button className="text-right">اعضاء</button>
                    </ScrollLink>

                    <ScrollLink to="work" smooth={true} duration={500} onClick={() => setOpen(false)}>

      <button className="text-right">نمونه‌کارها</button>
                    </ScrollLink>
      </>)}

    </div>
  </>
)}
        </nav>
    );
}