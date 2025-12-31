"use client";
import Image from "next/image";
import React  from "react";
import ReactPlayer from "react-player";

export default function CinemaPlayer() {


  return (
    <section className="flex justify-center items-center bg-linear-to-b from-[#002549] to-[#00203f] p-10">

<main className="flex md:flex-row flex-col justify-around items-center max-w-7xl">

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
 <p className="text-gray-300 text-xs md:text-sm xl:text-lg text-justify">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.</p>

    </div>
    <div className="w-86 md:w-96">

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
                            src={"/faraidea.png"}
                            width={600}
                            height={400}
                            alt='LOGO'/>
    </div>
                            </div>
                            </main>
    </section>
  );
}