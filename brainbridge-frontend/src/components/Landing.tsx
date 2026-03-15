'use client';
import { useLanguageStore } from '../stores/languageStore';
import { motion } from 'framer-motion';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  const { t } = useLanguageStore();

  return (
    <div className="w-full flex flex-col items-center max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="w-full px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-center order-2 lg:order-1"
        >
          <div className="relative w-full max-w-xl aspect-[1.3/1] flex items-center justify-center">
             <img 
               src="/images/kids.png" 
               alt="Happy Kids" 
               className="relative z-10 w-full h-auto object-contain max-h-[500px]" 
             />
             {/* Background decorative blob */}
             <div className="absolute inset-0 bg-blue-100/50 rounded-[4rem] -rotate-3 scale-110 -z-10" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-8 order-1 lg:order-2 text-center lg:text-left"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-6xl md:text-8xl font-black text-slate-800 leading-[1.05] tracking-tight">
              {t('landing.title')}
            </h2>
            <p className="text-2xl md:text-4xl font-medium text-slate-500/80 leading-snug">
              {t('landing.subtitle')}
            </p>
          </div>
          
          <button 
            onClick={onStart}
            className="group relative bg-secondary hover:bg-orange-500 text-white text-3xl font-black px-16 py-6 rounded-[2.5rem] btn-playful w-fit mx-auto lg:mx-0 shadow-[0_12px_0_0_#CC7000] active:shadow-[0_4px_0_0_#CC7000] active:translate-y-1 transition-all"
          >
            {t('landing.start')}
          </button>
        </motion.div>
      </section>

      {/* Games Section */}
      <section className="w-full px-8 py-16 flex flex-col gap-16">
        <h3 className="text-5xl font-black text-center text-slate-800">
          {t('landing.games_heading')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Card 1: Dyslexia */}
          <motion.div 
            whileHover={{ y: -15 }}
            className="bg-white p-10 rounded-[3.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-b-[15px] border-cyan-400 flex flex-col items-center gap-8"
          >
            <div className="bg-cyan-50 w-full aspect-video rounded-[2.5rem] flex items-center justify-center text-8xl">
              <span className="transform group-hover:rotate-12 transition-transform">📖</span>
            </div>
            <div className="text-center">
              <h4 className="text-4xl font-black text-slate-800">{t('games.mirror.title')}</h4>
              <p className="text-2xl text-slate-500 font-bold mt-2 uppercase tracking-wide">{t('games.mirror.subtitle')}</p>
            </div>
          </motion.div>

          {/* Card 2: Dyscalculia */}
          <motion.div 
            whileHover={{ y: -15 }}
            className="bg-white p-10 rounded-[3.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-b-[15px] border-emerald-400 flex flex-col items-center gap-8"
          >
            <div className="bg-emerald-50 w-full aspect-video rounded-[2.5rem] flex items-center justify-center text-8xl">
              <span className="transform group-hover:-rotate-12 transition-transform">🔢</span>
            </div>
            <div className="text-center">
              <h4 className="text-4xl font-black text-slate-800">{t('games.jump.title')}</h4>
              <p className="text-2xl text-slate-500 font-bold mt-2 uppercase tracking-wide">{t('games.jump.subtitle')}</p>
            </div>
          </motion.div>

          {/* Card 3: ADHD */}
          <motion.div 
            whileHover={{ y: -15 }}
            className="bg-white p-10 rounded-[3.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-b-[15px] border-amber-400 flex flex-col items-center gap-8"
          >
            <div className="bg-amber-50 w-full aspect-video rounded-[2.5rem] flex items-center justify-center text-8xl">
              <span className="animate-pulse">🎯</span>
            </div>
            <div className="text-center">
              <h4 className="text-4xl font-black text-slate-800">{t('games.focus.title')}</h4>
              <p className="text-2xl text-slate-500 font-bold mt-2 uppercase tracking-wide">{t('games.focus.subtitle')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none select-none">
        <div className="absolute top-[15%] left-[5%] text-6xl animate-float">✨</div>
        <div className="absolute top-[60%] right-[8%] text-7xl animate-float animation-delay-2000">🎨</div>
        <div className="absolute bottom-[20%] left-[10%] text-6xl rotate-12">🧩</div>
        <div className="absolute top-[10%] right-[15%] text-6xl -rotate-12">🧸</div>
      </div>
    </div>
  );
}
