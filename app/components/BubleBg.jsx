'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function BubbleBackground({ BubbleColors ={} }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;


    // رنگ‌ها رو از پراپ بگیر
    const colors = Object.values(BubbleColors);

    // ساخت حباب‌ها
// ساخت حباب‌ها
const bubbles = Array.from({ length: 30 }).map(() => {
  const gray = Math.floor(Math.random() * 200);
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 30 + 10,
    color: { r: gray, g: gray, b: gray },
    alpha: Math.random() * 0.2 + 0.05, // خیلی کم‌رنگ‌تر
  };
});

bubbles.forEach((b) => {
  gsap.to(b, {
    y: b.y - 100 - Math.random() * 200,
    duration: 20 + Math.random() * 15, // کندتر
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
  gsap.to(b, {
    x: b.x + Math.random() * 100 - 50,
    duration: 24 + Math.random() * 12, // کندتر
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
});

// رسم حباب‌ها
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bubbles.forEach((b) => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${b.alpha})`;
    ctx.fill();
  });
}

    // انیمیشن حرکت حباب‌ها با GSAP
    bubbles.forEach((b) => {
      gsap.to(b, {
        y: b.y - 100 - Math.random() * 200,
        duration: 10 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to(b, {
        x: b.x + Math.random() * 100 - 50,
        duration: 12 + Math.random() * 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    gsap.ticker.add(draw);

    // ریسایز
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(draw);
    };
  }, [BubbleColors]);

  return (
    <canvas
      ref={canvasRef}
      className="z-10 absolute inset-0 bg-linear-to-b shadow-2xl w-full h-full"
    />
  );
}