'use client';
import { useLanguageStore } from '../stores/languageStore';
import { useAuth } from '../stores/AuthContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import InteractiveMascot from './InteractiveMascot';


interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  const { t } = useLanguageStore();
  const { user } = useAuth();
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(false);

  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleLaunch = () => {
    if (user) {
      setIsLaunching(true);
      setTimeout(() => {
        onStart();
      }, 1500); 
    } else {
      onStart();
    }
  };

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const yHeroText = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);


  return (
    <div ref={containerRef} className="w-full flex flex-col items-center max-w-7xl mx-auto pb-32">
      {/* Hero Section */}
      <section className="w-full px-8 py-24 lg:py-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative overflow-visible">
        {/* Decorative Floating Elements (Parallax) */}
        <motion.div 
          style={{ y: yBackground }}
          className="absolute -top-10 -left-10 w-48 h-48 md:w-72 md:h-72 lg:w-[400px] lg:h-[400px] bg-indigo-500/10 blur-[100px] rounded-full animate-blob pointer-events-none z-[-1]" 
        />
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "30%"]) }}
          className="absolute top-20 -right-20 w-40 h-40 md:w-60 md:h-60 lg:w-[300px] lg:h-[300px] bg-rose-500/10 blur-[90px] rounded-full animate-blob [animation-delay:2s] pointer-events-none z-[-1]" 
        />


        <motion.div 
          initial={{ opacity: 0, x: -100, rotate: -5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="flex justify-center order-2 lg:order-1 relative z-20"
        >
          <div className="relative group perspective-1000">
            <InteractiveMascot />
            
            {/* Playful Floating Icons */}
            <motion.div 
              className="absolute -top-16 -left-16 text-7xl select-none"
              animate={{ y: [0, -30, 0], rotate: [0, 15, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              🦄
            </motion.div>
            <motion.div 
              className="absolute -bottom-10 -right-20 text-7xl select-none relative z-30"
              animate={isLaunching ? { 
                y: -1000, 
                x: 500,
                scale: 2,
                rotate: 45,
                opacity: [1, 1, 0]
              } : { y: [0, -40, 0], scale: [1, 1.2, 1] }}
              transition={isLaunching ? { duration: 1.5, ease: "easeIn" } : { duration: 4, repeat: Infinity, delay: 1 }}
            >
              🚀
              {isLaunching && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [1, 2, 3] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-20 bg-gradient-to-t from-transparent via-orange-500 to-yellow-300 blur-md rounded-full"
                />
              )}
            </motion.div>

            <motion.div 
              className="absolute top-1/2 -right-24 text-6xl select-none"
              animate={{ x: [0, 20, 0], rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              🎡
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          style={{ y: yHeroText }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col gap-10 order-1 lg:order-2 text-center lg:text-left relative z-20"
        >
          <div className="flex flex-col gap-6">
            <AnimatePresence>
              {showWelcome && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-block px-6 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 rounded-full font-bold text-xs uppercase tracking-widest w-fit mx-auto lg:mx-0 shadow-sm cursor-default"
                >
                   ✨ {user ? `Howdy, ${user.username}!` : (t('landing.welcome') || 'Welcome to BrainBridge')}
                </motion.div>
              )}
            </AnimatePresence>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              {t('landing.title')}
            </h2>
            <p className="text-lg md:text-xl font-semibold text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t('landing.subtitle')}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            {user ? (
              <>
                <button 
                  onClick={handleLaunch}
                  disabled={isLaunching}
                  className={`btn-primary text-lg px-12 py-6 shadow-indigo-600/20 active:translate-y-1 transition-all ${isLaunching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLaunching ? 'LIFT OFF! 🚀' : t('landing.start')}
                </button>

                <div className="flex items-center gap-4 px-8 py-4 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-700">Explorer {user.username}</span>
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => router.push('/login')}
                  className="btn-primary text-lg px-10 py-6 shadow-indigo-600/20 active:translate-y-1 transition-all"
                >
                  Login 🔐
                </button>
                <button 
                  onClick={() => router.push('/signup')}
                  className="px-10 py-6 bg-white border-2 border-indigo-600 text-indigo-600 rounded-[2rem] font-bold text-lg hover:bg-indigo-50 shadow-sm shadow-indigo-100 active:translate-y-1 transition-all"
                >
                  Register 🦄
                </button>
              </>

            )}
          </div>

        </motion.div>
      </section>

      {/* Games Section */}
      <section className="w-full px-8 py-24 flex flex-col gap-16 relative z-20">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-5xl font-black text-center text-slate-900 tracking-tight uppercase">
            {t('landing.games_heading')}
          </h3>
          <div className="w-24 h-2 bg-indigo-600 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 perspective-1000">
          {/* Card 1: Letter Mirror */}
          <motion.div 
            whileHover={{ y: -20, rotateY: 10, scale: 1.02 }}
            className="glass-card p-10 flex flex-col items-center gap-10 border-b-[16px] border-rose-500 overflow-hidden relative group"
          >
            <div className="bg-gradient-to-br from-rose-500 to-rose-400 w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-8xl shadow-xl animate-float-slow">
              🪞
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-black text-slate-900 leading-tight">{t('games.mirror.title')}</h4>
              <p className="text-lg text-rose-500 font-bold mt-2 uppercase tracking-widest">{t('games.mirror.subtitle')}</p>
            </div>
            <p className="text-lg text-slate-500 text-center font-medium leading-relaxed px-2">
              Step into the magic mirror world and play with letters!
            </p>
          </motion.div>

          {/* Card 2: Number Jump */}
          <motion.div 
            whileHover={{ y: -20, rotateY: -10, scale: 1.02 }}
            className="glass-card p-10 flex flex-col items-center gap-10 border-b-[16px] border-sky-500 overflow-hidden relative group"
          >
            <div className="bg-gradient-to-br from-sky-500 to-sky-400 w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-8xl shadow-xl animate-float-slow [animation-delay:0.5s]">
              🏝️
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-black text-slate-900 leading-tight">{t('games.jump.title')}</h4>
              <p className="text-lg text-sky-500 font-bold mt-2 uppercase tracking-widest">{t('games.jump.subtitle')}</p>
            </div>
            <p className="text-lg text-slate-500 text-center font-medium leading-relaxed px-2">
              Jump from island to island by solving fun number puzzles!
            </p>
          </motion.div>

          {/* Card 3: Focus Catcher */}
          <motion.div 
            whileHover={{ y: -20, rotateY: 10, scale: 1.02 }}
            className="glass-card p-10 flex flex-col items-center gap-10 border-b-[16px] border-amber-500 overflow-hidden relative group"
          >
            <div className="bg-gradient-to-br from-amber-500 to-amber-400 w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-8xl shadow-xl animate-float-slow [animation-delay:1s]">
              🔭
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-black text-slate-900 leading-tight">{t('games.focus.title')}</h4>
              <p className="text-lg text-amber-500 font-bold mt-2 uppercase tracking-widest">{t('games.focus.subtitle')}</p>
            </div>
            <p className="text-lg text-slate-500 text-center font-medium leading-relaxed px-2">
              Catch the magical star creatures in the space garden!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Decorative Floating Elements Foreground */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none select-none">
        <motion.div className="absolute top-[10%] left-[2%] text-8xl" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>⭐</motion.div>
        <motion.div className="absolute top-[70%] right-[3%] text-9xl animate-float">☁️</motion.div>
        <motion.div className="absolute bottom-[10%] left-[5%] text-8xl animate-wiggle">🧩</motion.div>
        <motion.div className="absolute top-[40%] right-[10%] text-7xl rotate-12 animate-bounce-soft">🎨</motion.div>
        <motion.div className="absolute bottom-[25%] right-[15%] text-8xl -rotate-12 animate-sparkle">✨</motion.div>
      </div>
    </div>
  );
}
