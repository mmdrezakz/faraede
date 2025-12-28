'use client';

import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { gsap } from 'gsap';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

const packages = [
  {
    title: 'پکیج دانشجویی',
    price: 'از ۵,۹۹۰,۰۰۰ تومان',
    features: [
      'طراحی ریسپانسیو',
      'تا ۳ صفحه',
      'دامنه و هاست یک‌ساله ',
      'سئوی پایه',
      'پشتیبانی ۱ ماهه',
    ],
  },
  {
    title: 'پکیج  رزومه',
    price: 'از ۷,۵۰۰,۰۰۰ تومان',
    features: [
      'وبسایت شخصی',
      'طراحی مینیمال',
      'گالری پروژه‌ها',
      'سئوی پایه',
      'پشتیبانی ۳ ماهه',
    ],
  },
  {
    title: 'پکیج لندینگ پیج',
    price: 'از ۸,۹۹۰,۰۰۰ تومان',
    features: [
      'صفحه فرود فروش‌محور',
      'طراحی جذاب',
      'فرم سفارش یا درگاه',
      'سئوی پیشرفته',
      'پشتیبانی ۲ ماهه',
    ],
  },
  {
    title: 'پکیج پایه',
    price: 'از ۱۵,۰۰۰,۰۰۰ تومان',
    features: [
      'تا ۵ صفحه',
      'ریسپانسیو کامل',
      'سئوی پایه',
      'پشتیبانی ۳ ماهه',
      'مشاوره آنلاین'
    ],
  },
  {
    title: 'پکیج حرفه‌ای',
    price: 'از ۳۵,۰۰۰,۰۰۰ تومان',
    features: [
      'UI/UX اختصاصی',
      'تا ۱۰ صفحه + بلاگ',
      'فرانت‌اند پیشرفته',
      'پشتیبانی ۶ ماهه',
      'مشاوره آنلاین'
    ],
  },
  {
    title: 'پکیج پرمیوم',
    price: 'از ۷۰,۰۰۰,۰۰۰ تومان',
    features: [
      'فرانت + بک‌اند',
      'پنل مدیریت',
      'سئوی کامل',
      'پشتیبانی VIP ۱۲ ماهه',
      'مشاوره آنلاین'
    ],
  },
  {
    title: 'پکیج فروشگاهی',
    price: 'از ۵۰,۰۰۰,۰۰۰ تومان',
    features: [
      'فروشگاه کامل',
      'درگاه پرداخت',
      'مدیریت محصولات',
      'پشتیبانی ۶ ماهه',
      'مشاوره آنلاین'
    ],
  },
  {
    title: 'پکیج انترپرایز',
    price: 'تماس بگیرید',
    features: [
      'فول استک سفارشی',
      'امنیت پیشرفته',
      'چندزبانه',
      'پشتیبانی نامحدود',
      'مشاوره آنلاین'
    ],
  },
];
export default function PackageSwiper() {
  const slideRefs = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      slideRefs.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="bg-linear-to-b from-[#001122] to-[#002233] py-16" dir="rtl">
      <div className="mx-auto px-6 max-w-7xl">
        <h2 className="mb-6 font-bold text-white text-4xl md:text-5xl text-center">
          پکیج‌ها
        </h2>
        <p className="mb-16 text-cyan-300 text-xl text-center">
          انتخاب پکیج مناسب برای کسب‌وکار شما – با پشتیبانی حرفه‌ای و توسعه VIP
        </p>

        <Swiper
          modules={[Autoplay, Pagination]}
          loop={false}
          centerInsufficientSlides={true}
          slidesPerView={1}
          spaceBetween={30}
          autoplay={{
            delay: 2000,                  // هر ۴ ثانیه عوض بشه
            disableOnInteraction: false,  // حتی بعد از کلیک هم ادامه بده
          }}
          speed={800}                     // انیمیشن نرم و حرفه‌ای
          pagination={{
            clickable: true,
            dynamicBullets: true,         // نقطه‌های کوچیک‌تر برای اسلایدهای غیرفعال
          }}
          grabCursor={true}
          breakpoints={{
            "640": { slidesPerView: 1.2, spaceBetween: 20 },
            "768": { slidesPerView: 2.2, spaceBetween: 30 },
            "1024": { slidesPerView: 3.2, spaceBetween: 40 },
            "1280": { slidesPerView: 4, spaceBetween: 40 },
          }}
          className="pb-12 package-swiper"
        >
          {packages.map((pkg, index) => (
            <SwiperSlide key={index}>
              <div
                ref={(el) => (slideRefs.current[index] = el)}
                className="group relative bg-[#101828] shadow-2xl hover:shadow-[#0066ff]/40 border border-[#0066ff]/20 hover:border-[#0066ff] rounded-3xl h-full overflow-hidden hover:scale-105 transition-all duration-700"
                style={{ minHeight: '560px' }}
              >
                {/* Glow و گرادیان hover */}
                <div className="absolute inset-0 bg-linear-to-br from-[#0066ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -inset-1 bg-[#0066ff] opacity-0 group-hover:opacity-30 blur-2xl rounded-3xl transition duration-1000" />

                <div className="z-10 relative flex flex-col p-10 h-full text-center">
                  <h3 className="mb-8 font-bold text-[#0066ff] group-hover:text-white text-3xl transition-colors duration-500">
                    {pkg.title}
                  </h3>

                  <ul className="flex-1 space-y-5 mb-10 text-white/85 text-lg">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex justify-center items-center">
                        <span className="ml-3 font-bold text-[#0066ff] text-2xl">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div>
                    <p className="mb-8 font-extrabold text-[#0066ff] group-hover:text-yellow-300 text-2xl transition-colors duration-500">
                      {pkg.price}
                    </p>
                    <button className="bg-[#0066ff] hover:bg-white shadow-lg hover:shadow-[#0066ff]/50 px-10 py-4 rounded-full font-bold text-white hover:text-[#002233] transition-all duration-500">
                      سفارش پکیج
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* استایل سفارشی برای pagination (نقطه‌ها) */}
        <style jsx global>{`
          .package-swiper .swiper-pagination {
            bottom: 10px !important;
          }
          .package-swiper .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
            background: rgba(0, 102, 255, 0.3);
            opacity: 0.6;
            transition: all 0.4s ease;
          }
          .package-swiper .swiper-pagination-bullet-active {
            background: #0066ff;
            opacity: 1;
            transform: scale(1.4);
            box-shadow: 0 0 15px #0066ff88;
          }
        `}</style>
      </div>
    </div>
  );
}