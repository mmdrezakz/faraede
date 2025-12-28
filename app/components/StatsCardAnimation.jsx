'use client'
import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function StatsCardAnimated({ icon: Icon, label, value }) {
  const numberRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // اجرای انیمیشن وقتی دیده شد
            gsap.fromTo(
              numberRef.current,
              { innerText: 0 },
              {
                innerText: value,
                duration: 2,
                ease: "power3.out",
                snap: { innerText: 1 },
              }
            )

            // انیمیشن کارت
            gsap.fromTo(
              el,
              { opacity: 0, scale: 0.8, y: 30 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
              }
            )
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [value])

  return (
    <div
      ref={cardRef}
      className="flex items-center gap-3 bg-[#101828] shadow hover:shadow-[#0066ff]/40 mt-5 p-2 md:p-8 lg:px-9 border border-[#0066ff]/20 hover:border-[#0066ff] rounded-lg text-white transition-all duration-700 hover:cursor-pointer"
    >
      <div className="text-blue-200 text-3xl">
        <Icon />
      </div>

      <div>
        <p className="text-gray-200 text-xs md:text-sm text-center">{label}</p>
        <p ref={numberRef} className="font-bold text-xl text-center"></p>
      </div>
    </div>
  )
}