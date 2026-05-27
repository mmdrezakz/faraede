'use client'
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function AnimatedIconInView({ children }) {
  const { ref, inView } = useInView({
    triggerOnce: false,   // هر بار دیده شد دوباره انیمیشن اجرا شود
    threshold: 0.3,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={
        inView
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.5, y: 20 }
      }
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="inline-flex"
    >
      {children}
    </motion.div>
  )
}