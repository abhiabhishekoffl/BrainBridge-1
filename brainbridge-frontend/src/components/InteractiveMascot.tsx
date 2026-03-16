'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export default function InteractiveMascot({ className = "w-80 h-80" }: { className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  
  // Use a fallback for window size to avoid SSR issues
  const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const winHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  const eyeX = useSpring(useTransform(mouseX, [0, winWidth], [-10, 10]), springConfig);
  const eyeY = useSpring(useTransform(mouseY, [0, winHeight], [-10, 10]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className={`relative flex items-center justify-center cursor-pointer select-none aspect-square ${className}`}

      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9, rotate: 8 }}
    >
      {/* Dynamic Vibrant Glow Effects */}
      <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full animate-blob mix-blend-screen" />
      <div className="absolute inset-0 bg-rose-500/10 blur-[50px] rounded-full animate-blob [animation-delay:2s] mix-blend-screen" />

      {/* Mascot Body (Squishy & Animated) */}
      <motion.div 
        className="relative z-10 w-48 h-48 bg-gradient-to-br from-indigo-400 via-indigo-600 to-indigo-800 rounded-[3rem] border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden"
        animate={{
          y: [0, -12, 0],
          scaleY: [1, 0.96, 1.02, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Face Layers */}
        <div className="flex flex-col items-center gap-4 relative z-20">
          <div className="flex gap-8 relative">
             {/* Left Eye */}
             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-slate-900 shadow-inner">
                <motion.div 
                  style={{ x: eyeX, y: eyeY }}
                  className="w-6 h-6 bg-slate-900 rounded-full relative"
                >
                   <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-90" />
                </motion.div>
             </div>
             {/* Right Eye */}
             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-slate-900 shadow-inner">
                <motion.div 
                  style={{ x: eyeX, y: eyeY }}
                  className="w-6 h-6 bg-slate-900 rounded-full relative"
                >
                   <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-90" />
                </motion.div>
             </div>
          </div>

          {/* Happy Mouth */}
          <motion.div 
            className="w-12 h-6 border-b-4 border-slate-900 rounded-full bg-slate-900/10" 
            animate={{ 
              scaleX: [1, 1.1, 1],
              height: [12, 18, 12]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        {/* Blush Circles */}
        <div className="absolute left-4 top-[55%] w-6 h-3 bg-rose-400/30 blur-sm rounded-full" />
        <div className="absolute right-4 top-[55%] w-6 h-3 bg-rose-400/30 blur-sm rounded-full" />
      </motion.div>
      
      {/* Floating Ears/Antennae */}
      <motion.div 
        className="absolute -top-6 -left-4 w-10 h-16 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-[2rem] rotate-[-25deg] border-2 border-white shadow-lg origin-bottom"
        animate={{ rotate: [-25, -15, -25] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -top-6 -right-4 w-10 h-16 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-[2rem] rotate-[25deg] border-2 border-white shadow-lg origin-bottom"
        animate={{ rotate: [25, 15, 25] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Playful Floating Particles */}
      <motion.div className="absolute -top-10 right-4 text-2xl animate-float-slow">⭐</motion.div>
      <motion.div className="absolute -bottom-2 -left-8 text-3xl animate-float-fast">✨</motion.div>
      <motion.div className="absolute top-1/2 -right-16 text-4xl animate-wiggle">🎨</motion.div>
      <motion.div className="absolute bottom-10 -right-4 text-3xl animate-bounce-soft">🎈</motion.div>
    </motion.div>
  );
}
