import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function StatsCardAnimated({ icon: Icon, label, value }) {
  const numberRef = useRef(null);

  useEffect(() => {
    // انیمیشن شمارش عدد
    gsap.fromTo(
      numberRef.current,
      { innerText: 0 },
      {
        innerText: value,
        duration: 2,
        ease: "power1.out",
        snap: { innerText: 1 }, // گرد کردن به عدد صحیح
      }
    );
  }, [value]);

  return (
    <div className="flex items-center gap-3 bg-white hover:bg-gray-100 shadow p-8 rounded-lg hover:scale-105 transition-all duration-700 hover:cursor-pointer">
      <div className="text-blue-600 text-3xl">
        <Icon />
      </div>

      <div>
        <p className="text-gray-500 text-xs md:text-sm">{label}</p>
        <p ref={numberRef} className="font-bold text-xl"></p>
      </div>
    </div>
  );
}