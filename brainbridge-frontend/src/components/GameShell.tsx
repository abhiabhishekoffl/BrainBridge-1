'use client';
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useLanguageStore } from '../stores/languageStore';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import InteractiveMascot from './InteractiveMascot';

interface GameShellProps {
  gameIndex: number;
  totalGames: number;
  timeRemaining: number;
  isRunning: boolean;
  onTimeUp: () => void;
  onExit: () => void;
  children: ReactNode;
  showSuccess?: boolean;
}

export default function GameShell({ 
  gameIndex, 
  totalGames, 
  timeRemaining, 
  isRunning, 
  onTimeUp, 
  onExit, 
  children,
  showSuccess = false
}: GameShellProps) {
  const { t } = useLanguageStore();

  const themes = [
    'bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-500', // Letter Quest
    'bg-gradient-to-br from-sky-400 via-emerald-400 to-teal-500', // Number Island
    'bg-gradient-to-br from-rose-600 via-rose-700 to-rose-500', // Cosmic Catcher
  ];

  const floatingIcons = [
    ['✨', '🪞', '🪄'], // Mirror
    ['🏝️', '⛵', '🐚'], // Island
    ['🚀', '⭐', '🛸'], // Space
  ];

  return (
    <div className={`flex flex-col min-h-screen ${themes[gameIndex] || themes[0]} relative p-4 md:p-10 font-sans transition-all duration-1000 overflow-hidden`}>
      {/* Dynamic Background Atmospheric Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingIcons[gameIndex]?.map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-9xl opacity-10"
            style={{ 
              top: `${20 + i * 30}%`, 
              left: i % 2 === 0 ? '5%' : '85%',
            }}
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 20, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 6 + i, 
              repeat: Infinity, 
              delay: i * 2 
            }}
          >
            {icon}
          </motion.div>
        ))}
        {/* Animated Blobs */}
        <div className="bg-blob w-64 h-64 md:w-80 md:h-80 lg:w-[500px] lg:h-[500px] bg-white/10 top-[-10%] right-[-10%] animate-blob" />
        <div className="bg-blob w-48 h-48 md:w-64 md:h-64 lg:w-[400px] lg:h-[400px] bg-white/10 bottom-[-5%] left-[-5%] animate-blob [animation-delay:2s]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col h-full gap-10">
        {/* Header section */}
        <div className="flex justify-between items-center bg-white/20 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-white/40 shadow-xl">
          <div className="flex items-center gap-6">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-2xl transform -rotate-12 transition-all"
            >
               <span className="text-indigo-600 text-4xl font-black">B</span>
            </motion.div>
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tighter leading-none">BrainBridge</h2>
              <p className="text-white/80 font-black mt-1 uppercase tracking-[0.2em] text-[0.6rem] md:text-[0.65rem] bg-indigo-900/20 w-fit px-2 py-0.5 rounded-full">
                {t('shell.level') || 'Level'} {gameIndex + 1}
              </p>
            </div>


          </div>
          <button 
            onClick={onExit}
            className="px-10 py-4 rounded-2xl bg-white/20 text-white font-black hover:bg-white/40 active:scale-95 transition-all border-4 border-white/30 uppercase text-sm tracking-widest shadow-lg"
          >
            {t('shell.exit')}
          </button>
        </div>

        <ProgressBar current={gameIndex} total={totalGames} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
          {/* Sidebar Info */}
          <div className="lg:col-span-3 flex flex-col gap-8 order-2 lg:order-1">
            <div className="bg-white/20 backdrop-blur-md p-8 flex items-center justify-center shadow-2xl rounded-[2.5rem] border border-white/30">
              <Timer duration={timeRemaining} onTimeUp={onTimeUp} isRunning={isRunning} />
            </div>
            
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white/40 backdrop-blur-md p-6 md:p-10 flex flex-col items-center gap-6 text-center shadow-xl rounded-[3rem] border-2 border-white/50"
            >

              <div className="w-24 h-24 md:w-32 md:h-32">
                <InteractiveMascot />
              </div>
              <p className="text-white font-black text-base md:text-lg leading-tight drop-shadow-md">
                &quot;{t('shell.mascot_cheer') || "You're doing amazing!"}&quot;
              </p>


            </motion.div>
          </div>

          {/* Game Content Area */}
          <div className="lg:col-span-9 bg-white p-4 md:p-8 lg:p-12 relative flex flex-col justify-center min-h-[350px] md:min-h-[500px] shadow-2xl rounded-[2.5rem] border-4 border-indigo-100 overflow-hidden order-1 lg:order-2 text-indigo-950">




            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-amber-400 via-white to-transparent opacity-50"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={gameIndex}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="relative z-10"
              >
                {children}
              </motion.div>
            </AnimatePresence>

            {/* Success Feedback Overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm pointer-events-none"
                >
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1.5, rotate: 0 }}
                    className="bg-white p-10 rounded-full shadow-2xl text-8xl"
                  >
                    🌟
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
