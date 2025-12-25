'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Istyping.css';

export default function IsTyping() {
  const textRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      {
        opacity: 0,
        y: 40,
        filter: "blur(12px)",
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        scale: 1,
        duration: 1.6,
        ease: "bounce.in",
      }
    );
  }, []);

  return (
    <div className="z-40 typewriter">
      <h1 ref={textRef}>با بیش از سه سال سابقه در برنامه نویسی تحت وب</h1>
    </div>
  );
}