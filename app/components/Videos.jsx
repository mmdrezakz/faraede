"use client";
import Image from "next/image";
import React  from "react";
import ReactPlayer from "react-player";

export default function CinemaPlayer() {


  return (
    <section id="work" className="flex justify-center items-center bg-linear-to-b from-[#002549] to-[#00203f] md:p-10">

<main className="flex md:flex-row flex-col justify-around items-center w-[80%] md:max-w-7xl">

    <div className="rounded-2xl w-full"
      style={{
        position: "relative",
        
        
        
        overflow: "hidden",
      }}
      >
      <h2 className="mb-6 font-bold text-white text-2xl md:text-4xl">نمونه کار</h2>
      <ReactPlayer className="shadow-2xs shadow-blue-200 border-4 border-blue-400 rounded-xl"
        
        src="/programmer/video1.mp4"
        playing={false}
        
        width="100%"
        height="100%"
        controls={true}
        />

 <h3 className="mt-6 font-semibold text-white text-xl">توضیحات پروژه</h3>
 <div className="mr-2 text-gray-300 text-xs md:text-sm xl:text-lg text-justify">
  <p className="my-4">عنوان: فروشگاه آنلاین (Online Shop)</p>
            <ul className="space-y-2 pr-4 list-disc">
              <li>طراحی واکنش‌گرا با Flexbox - نمایش عالی در موبایل، تبلت و دسکتاپ</li>
              <li>گرادینت سینمایی اختصاصی از آبی تیره به آبی عمیق برای حس حرفه‌ای</li>
              <li>پلیر ویدیویی پیشرفته با ReactPlayer - قابلیت پخش، توقف و کنترل کامل</li>
              <li>بهینه‌سازی تصاویر با کامپوننت Image نکست - لودینگ هوشمند و Lazy Loading</li>
              <li>تایپوگرافی هوشمند در سه اندازه (xs, sm, xl) متناسب با دستگاه کاربر</li>
              <li>برندینگ اختصاصی با نمایش لوگو و هویت بصری "فرآیند ایده"</li>
            </ul>


    </div>
    </div>

    <div className="md:w-96">

        <div className='flex justify-center md:w-auto'>
    
                        <Image
                            className=''
                            src={"/programmer/end.png"}
                            width={400}
                            height={400}
                            alt='LOGO'/>
    </div>
    <div className='flex justify-center md:w-auto'>
    
                        <Image
                            className=''
                            src={"/favicon/1mmd.png"}
                            width={600}
                            height={400}
                            alt='LOGO'/>
    </div>
                            </div>
                            </main>
    </section>
  );
}