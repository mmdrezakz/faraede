'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Playpen_Sans_Arabic } from 'next/font/google'
import { FolderKanban, KeyboardIcon, ThumbsUp, User2Icon, UsersRound } from 'lucide-react'
import StatsCardAnimated from './components/StatsCardAnimation'
import LogoIntroSection from './components/LogoIntroSection'
import AnimatedIconInView from "./components/IconAnimateIntroSection"
import { Link as ScrollLink } from 'react-scroll';


const logos = [
    { id: 1, src: "/logo/logo1.webp" },
    { id: 2, src: "/logo/logo2.webp" },
    { id: 3, src: "/logo/logo3.webp" },
    { id: 4, src: "/logo/logo4.webp" },
    { id: 5, src: "/logo/logo5.webp" },
    { id: 6, src: "/logo/logo2.webp" }
]

const playpen = Playpen_Sans_Arabic({
    subsets: ['latin', 'arabic'],
    weight: '400',
    preload: true
})

export default function IntroSection() {
    const [stats, setStats] = useState({
        packages: 0,
        users: 0,
        employees: 3 // تعداد کارکنان ثابت
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            // دریافت تعداد پکیج‌ها
            const packagesRes = await fetch('/api/packages')
            const packagesData = await packagesRes.json()
            
            // دریافت تعداد کاربران
            const usersRes = await fetch('/api/users/count')
            const usersData = await usersRes.json()

            setStats({
                packages: packagesData.length || 0,
                users: usersData.count || 0,
                employees: 3
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className={`${playpen.className} bg-gray-100`}>
            <header className='items-center gap-3 md:gap-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 mx-10 sm:mx-16 md:mx-8 px-2 pt-5'>
                {logos.map(item => (
                    <LogoIntroSection key={item.id} src={item.src} alt={item.id} />
                ))}
            </header>
            
            <div className='flex md:flex-row flex-col md:justify-center md:mt-10'>
                <main className='flex flex-col justify-center items-center mx-5 xs:mx-10 mt-2 mb-1 p-4 md:max-w-2xl text-gray-700 text-lg md:text-xl lg:text-2xl text-justify'>
                    <div className='flex justify-center items-start gap-2'>
                        <AnimatedIconInView>
                            <UsersRound />
                        </AnimatedIconInView>
                        <h2>
                            تیم طراحی و توسعه ما از سال ۱۴۰۲ فعالیت خود را آغاز کرده و تمرکز اصلی‌مان بر ساخت سایت‌های مدرن، سریع و حرفه‌ای است.  
                            با استفاده از بهترین تکنولوژی‌های روز، وبسایتی می‌سازیم که نه تنها زیبا باشد، بلکه عملکردی بی‌نقص داشته باشد.
                        </h2>
                    </div>
                    
                    <div className='flex items-center gap-2 mt-4 md:mr-20 w-full text-sm'>
                        <ScrollLink to="work" smooth={true} duration={500}>


                        <button className='bg-[#0066ff] hover:bg-[#025de6] shadow-lg hover:shadow-[#0066ff]/50 px-4 py-1 rounded-lg font-bold text-white transition-all duration-500 cursor-pointer'>
                            نمونه کار ها
                        </button>
                        </ScrollLink>
                        <ScrollLink to="team" smooth={true} duration={500}>

                        <button className='bg-[#0066ff] hover:bg-[#025de6] shadow-lg hover:shadow-[#0066ff]/50 px-4 py-1 rounded-lg font-bold text-white transition-all duration-500 cursor-pointer'>
                            اعضاء
                        </button>
                        </ScrollLink>
                    </div>

                    <div className='md:hidden flex justify-center items-center'>
                        <Image src={"/working3.png"} className='md:hidden block' width={400} height={400} alt='working team' />
                    </div>

                    <div className='flex justify-center items-start gap-2 mt-5 text-gray-500'>
                        <AnimatedIconInView>
                            <ThumbsUp />
                        </AnimatedIconInView>
                        <h4 className='xs:text-xs sm:text-sm md:text-lg'>
                            ما با بهترین تکنولوژی ها سایت شمارو طراحی میکنیم
                        </h4>
                    </div>
                    
                    {/* کارت‌های آمار - داینامیک */}
                    <div className="justify-items-center items-baseline gap-5 gap-y-4 grid grid-cols-3">
                        <StatsCardAnimated 
                            icon={KeyboardIcon} 
                            label="کارکنان" 
                            value={stats.employees} 
                        />
                        <StatsCardAnimated 
                            icon={FolderKanban} 
                            label="پکیج‌ها" 
                            value={stats.packages} 
                        />
                        <StatsCardAnimated 
                            icon={User2Icon} 
                            label="کاربران" 
                            value={stats.users} 
                        />
                    </div>
                </main>
                
                <div className='justify-center items-center grid grid-cols-1 lg:grid-cols-2'>
                    <div className='flex justify-center items-center'>
                        <Image src={"/working3.png"} className='hidden md:block' width={400} height={400} alt='working team' />
                    </div>
                    <div className='flex justify-center md:w-auto'>
                        <Image
                            className=''
                            src={"/favicon/1mmd.png"}
                            width={400}
                            height={200}
                            alt='LOGO'
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}