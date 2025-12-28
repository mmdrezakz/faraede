'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, EffectFade, Autoplay } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation'; // اضافه کن اگر نداشتی

// داده‌های نظرات
const testimonials = [
  {
    id: 1,
    ax: "/comment/3.png",
    name: "سارا محمدی",
    username: "@sara_mohammadi",
    avatar: "/comment/sara.jpg",
    comment: "تیم خیلی حرفه‌ای و خلاق بود! سایت دقیقاً همون چیزی شد که تو ذهنم بود و حتی بهتر. سرعت تحویل پروژه هم عالی بود. حتماً دوباره باهاتون همکاری می‌کنم.",
    rating: 5
  },
  {
    id: 2,
    ax: "/comment/2.png",
    name: "علی رضایی",
    username: "@alirezaei_dev",
    avatar: "/comment/mard1.jpg",
    comment: "از طراحی مدرن و ریسپانسیو سایت خیلی راضی‌ام. پشتیبانی بعد از تحویل پروژه هم فوق‌العاده بود و هر سوالی داشتم سریع جواب دادن. توصیه می‌کنم!",
    rating: 5
  },
  {
    id: 3,
    ax: "/comment/2.png",
    name: "نیما احمدی",
    username: "@nima_ahmadi",
    avatar: "/comment/mard2.jpg",
    comment: "کار تمیز، قیمت مناسب و زمان‌بندی دقیق. سایت فروشگاهی که برام ساختن فروشم رو حسابی بالا برد واقعا من اینو پیشنهاد میکنم فوق العادست. ممنون از تیم حرفه‌ایتون!",
    rating: 5
  }
];

export default function ShowCommentSwiper() {
  return (
    <>
    {/* استایل‌های سفارشی برای pagination fraction */}
      <style jsx global>{`
        .custom-pagination .swiper-pagination-current {
          font-size: 2.5rem; /* 40px */
          font-weight: 800;
          color: #1f2937; /* text-gray-800 */
        }
        .custom-pagination .swiper-pagination-total {
          font-size: 1.5rem; /* 24px */
          font-weight: 600;
          color: #6b7280; /* text-gray-500 */
        }
        .custom-pagination .swiper-pagination-fraction {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    <div className="relative bg-gray-100 py-10">
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        spaceBetween={50}
        autoplay={true}
        slidesPerView={1}
        loop={true}
        effect="fade"
        direction="horizontal" // مهم برای RTL
        pagination={{
          type: 'fraction',
          el: '.custom-pagination', // <--- اینجا گفتم داخل این کلاس بریز
          
        }}
        navigation={{
          prevEl: '.custom-swiper-button-prev',
          nextEl: '.custom-swiper-button-next',
        }}
        className="h-full"
        >
        {testimonials.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="flex justify-center items-center px-8 md:px">
              <div className="items-center gap-12 grid grid-cols-1 md:grid-cols-2 mx-auto max-w-7xl">
                {/* بخش متن و پروفایل */}
                <div className="space-y-2 text-right">
                  <Image
                    src="/comment/virgol.png"
                    width={90}
                    height={90}
                    alt="گیومه"
                    className="ml-auto"
                    />

                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-4">
                      <div className='h-20'>

                      <Image
                        src={item.avatar}
                        width={80}
                        height={80}
                        alt={item.name}
                        className="shadow-lg border-4 border-white rounded-full h-full object-center object-cover"
                        />
                        </div>
                      <div className="text-right">
                        <h4 className="font-bold text-gray-900 text-xl">{item.name}</h4>
                        <p className="text-gray-600">{item.username}</p>
                      </div>
                    </div>
                  <p className="font-medium text-gray-800 text-lg 2xl:text-2xl leading-relaxed">
                    {item.comment}
                  </p>



                  </div>
                  <div className="z-10 flex items-center gap-6">
          {/* کپسول pagination */}

          <button className="bg-[#0066ff] hover:bg-[#0251c7] shadow-lg hover:shadow-[#0066ff]/50 px-6 md:px-10 py-2 md:py-4 rounded-full font-bold text-white transition-all duration-500 custom-swiper-button-prev">
            قبلی
          </button>
          <button className="bg-[#0066ff] hover:bg-[#0251c7] shadow-lg hover:shadow-[#0066ff]/50 px-6 md:px-10 py-2 md:py-4 rounded-full font-bold text-white transition-all duration-500 custom-swiper-button-next">
            بعدی
          </button>
        </div>
                </div>

                {/* تصویر پروژه - متفاوت برای هر اسلاید */}
                <div className="flex justify-center">
                  
                    <Image
                      src={item.ax}
                      width={800}
                      height={500}
                      alt="پروژه"
                      className="bg-[#101828] shadow-xs rounded-2xl"
                      />
                  
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* دکمه‌های سفارشی پایین راست */}

      </div>
        </>
   
  );
}