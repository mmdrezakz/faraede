'use client';

import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { gsap } from 'gsap';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import Link from 'next/link';
import AddToCartButton from './AddToCartBtn';
import { Spinner } from '@heroui/spinner';

export default function PackageSwiper() {  // ❌ formatPrice رو از props بردار
  const slideRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [tamas,setTamas] = useState(false)
  // ✅ فقط یکبار تابع رو تعریف کن (اینجا)
  const formatPrice = (price) => {
    if (price === "0"){

      
      return 'با ما تماس بگیرید '
      };
    const amount = Number(price);
    if (isNaN(amount) || amount === 0) return '۰ تومان';
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };
  
  useEffect(() => {
    fetchPackages();
  }, []);
  
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/packages');
      const data = await response.json();
      
      
      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }
      
      setPackages(data);
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    gsap.fromTo(
      slideRefs.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
    );
  }, []);
  if(loading){
    return(
      <div className="bg-linear-to-b from-[#001122] to-[#002233] h-screen" dir="rtl">
        <div className="flex flex-col justify-center items-center gap-4 mx-auto px-6 max-w-7xl h- h-screen">

                < Spinner classNames = {{
                  circle1: "text-gray-400",  // حلقه اول
                  circle2: "text-orange-500",  // حلقه دوم
                  wrapper: "text-[#001122]"     // wrapper
                }} variant = 'simple' size = 'lg' /> 
                <p className='text-white text-2xl'>درحال بارگذاری ...</p>
             
        </div>
      </div>
    )

  }
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
            delay: 4000,
            disableOnInteraction: false,
          }}
          speed={800}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          grabCursor={true}
          breakpoints={{
            "640": { slidesPerView: 1.2, spaceBetween: 20 },
            "768": { slidesPerView: 2.2, spaceBetween: 30 },
            "1024": { slidesPerView: 3.2, spaceBetween: 40 },
            "1280": { slidesPerView: 4, spaceBetween: 40 },
          }}
          className="pb-12 package-swiper" id='pkg'
        >

          {packages.map((pkg, index) => (
            <SwiperSlide key={pkg.id || index}>
              <div
                ref={(el) => (slideRefs.current[index] = el)}
                className="group relative bg-[#101828] shadow-2xl hover:shadow-[#0066ff]/40 border border-[#0066ff]/20 hover:border-[#0066ff] rounded-3xl h-full overflow-hidden transition-all duration-700"
                style={{ minHeight: '560px' }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-[#0066ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -inset-1 bg-[#0066ff] opacity-0 group-hover:opacity-30 blur-2xl rounded-3xl transition duration-1000" />

                <div className="z-10 relative flex flex-col p-10 h-full text-center">
                  <Link href={`/packages/${pkg.slugId}`}>
                    <h3 className="mb-8 font-bold text-[#0066ff] group-hover:text-white text-3xl transition-colors duration-500">
                      {pkg.title}
                    </h3>

                    <ul className="flex-1 space-y-5 mb-10 text-white/85 text-lg">
                      {pkg.features?.map((feature, i) => (
                        <li key={i} className="flex justify-center items-center">
                          <span className="ml-3 font-bold text-[#0066ff] text-2xl">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Link>

                  <div>
                    {/* ✅ استفاده از formatPrice داخلی */}
                    <p className="mb-8 font-extrabold text-[#0066ff] group-hover:text-yellow-300 text-2xl transition-colors duration-500">
                      {formatPrice(pkg.price)}
                    </p>
                    
                    <div className='flex justify-center items-center gap-5'>
                      <Link href={`/packages/${pkg.slugId}`}>
                        <button className="bg-[#0066ff] hover:bg-[#0251c7] shadow-lg hover:shadow-[#0066ff]/50 px-10 py-4 rounded-full font-bold text-white transition-all duration-500">
                          جزئیات
                        </button>
                      </Link>
                      <AddToCartButton 
                      pricePackage={pkg.price} 
                      setTamas={setTamas}
                      tamas={tamas}
                        packageId={pkg.id} 
                        className="bg-[#0066ff] hover:bg-[#0251c7] shadow-lg hover:shadow-[#0066ff]/50 px-5 py-4 rounded-full font-bold text-white transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}