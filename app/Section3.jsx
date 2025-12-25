import React from 'react'
import HorizontalLinearStepper from './components/steper'
import Image from 'next/image'


export default function Section3() {
  return (
    <div className='flex lg:flex-row flex-col justify-center items-center my-2 w-full'>
        
    <HorizontalLinearStepper />
    <div className='mx-8 mt-5 hover:scale-105 transition-all duration-700 ease-in-out'>
    <Image className='shadow-2xl shadow-orange-100 border-2 border-orange-400 rounded-2xl' width={800} height={400} alt='125416' src={"/step.jpg"} />

    </div>
    </div>
  )
}
