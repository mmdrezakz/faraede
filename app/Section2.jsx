import React from 'react'

export default function Section2() {
  return (
    <main className='relative min-h-screen section2'>
        <section className='absolute bg-linear-to-b from-[#fdfdfd2c] to-[#fbfcff] text-shadow-2xs text-shadow-gray-400 backdrop-brightness-80 w-full min-h-screen text-gray-950'>
            <div className='flex flex-col justify-center items-center mx-10 my-50 md:my-30 lg:my-46 text-center'>
                <p className='text-2xl md:text-4xl text-wrap'>تیم طراحی و توسعه<span  className='bg-orange-400 shadow-orange-600 shadow-xs mx-1 px-2 rounded-2xl'> فرا داده</span> فعالیت خود را از سال <span className="text-orange-500">1402</span> شروع کرده</p>
                <p className='mx-6 my-5 text-justify'>تیم ما تمرکز خودشو روی توسعه اپلیکیشن های تحت وب  جاوا اسکریپتی گذاشته </p>
                <p>با به روز ترین فن آوری ها پروژه رو پیش میبریم مثل :</p>
                <ul className='flex justify-center items-center gap-5 text-gray-950'>
                    {["React js","Next js","Node js","Tailwind Css"].map((item, index) => (
                        <li className='bg-orange-400 shadow-orange-600 shadow-xs text-shadow-2xs text-shadow-gray-300 mt-5 px-2 py-0.5 rounded-2xl text-sm' key={index}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    </main>
  )
}
