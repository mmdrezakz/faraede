'use client'
import Image from 'next/image'
import React from 'react'
import { Playpen_Sans_Arabic } from 'next/font/google'
import { FolderKanban, KeyboardIcon, ThumbsUp, User2Icon, UsersRound } from 'lucide-react'
import { AnimateIcon } from '@/components/animate-ui/icons/icon'
import StatsCardAnimated from './components/StatsCardAnimation'
import { motion,useInView } from "framer-motion"
import LogoIntroSection from './components/LogoIntroSection'
import AnimatedIconInView from "./components/IconAnimateIntroSection"



const logos =[
    {id:1,src:"/logo/logo1.webp"},
    {id:2,src:"/logo/logo2.webp"},
    {id:3,src:"/logo/logo3.webp"},
    {id:4,src:"/logo/logo4.webp"},
    {id:5,src:"/logo/logo5.webp"},
    {id:6,src:"/logo/logo2.webp"},

]
const playpen = Playpen_Sans_Arabic({
      subsets: ['latin'],
  weight: "400"
})

export default function IntroSection() {

  return (
    <section className={` ${playpen.className} bg-gray-50 min-h-[60vh] background-intro-section `} >
        <header className='items-center gap-3 md:gap-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 mx-10 sm:mx-16 md:mx-8 px-2 pt-5'>
                {logos.map(item => (

<LogoIntroSection key={item.id} src={item.src} alt={item.id} />

            
                  ))}
        </header>
        <div className='flex md:flex-row flex-col md:justify-center md:mt-10'>

        <main className='flex flex-col justify-center items-center mx-10 mt-2 mb-4 p-5 max-w-2xl text-gray-700 text-lg md:text-xl lg:text-2xl text-justify'>
        <div className='flex justify-center items-start gap-2'>

<AnimatedIconInView>
  <UsersRound />
</AnimatedIconInView>
            <h2>
            تیم طراحی و توسعه ی مافعالیتشو از سال 1402 شروع کرده و تمرکزمون روی سایت های مدرن و با طراحی های مدرن هست
            </h2>
        </div>
        <div className='flex justify-center items-start gap-2 mt-5 text-gray-500'>

            <AnimatedIconInView>
  <ThumbsUp />
</AnimatedIconInView>

            <h4 className='xs:text-xs sm:text-sm md:text-lg'>ما با بهترین تکنولوژی ها سایت شمارو طراحی میکنیم</h4>

        </div>
        </main>
        <div className="justify-items-center items-center gap-5 grid grid-cols-2 md:grid-cols-3">
      <StatsCardAnimated icon={KeyboardIcon} label="کارکنان" value={3} />
      <StatsCardAnimated icon={User2Icon} label="کاربران " value={43} />
      <StatsCardAnimated  icon={FolderKanban} label="پروژه" value={12} />

        </div>
        </div>

    </section>
  )
}


