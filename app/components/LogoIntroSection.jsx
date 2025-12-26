'use client'
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function LogoIntroSection({ src, alt }) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="hover:scale-105 transition-all duration-300"
    >
      <Image src={src} width={170} height={170} alt={alt} />
    </motion.div>
  )
}