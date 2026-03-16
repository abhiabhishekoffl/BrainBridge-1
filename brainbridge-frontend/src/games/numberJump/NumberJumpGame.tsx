'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NumberJumpProps {
  onGameComplete: (stats: { math_accuracy: number; math_response_latency: number; counting_accuracy: number }) => void;
}

const ROUNDS = 5;

export default function NumberJumpGame({ onGameComplete }: NumberJumpProps) {
  const [round, setRound] = useState(0);
  const [targetNumber, setTargetNumber] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [shake, setShake] = useState(false);
  const [jumping, setJumping] = useState(false);
  
  // Stats
  const [startTime, setStartTime] = useState(Date.now());
  const [errors, setErrors] = useState(0);
  const [totalReactionTime, setTotalReactionTime] = useState(0);

  useEffect(() => {
    if (round < ROUNDS) {
      const target = Math.floor(Math.random() * 8) + 3; // 3 to 10
      setTargetNumber(target);
      
      const incorrect1 = target + (Math.random() > 0.5 ? 1 : -1);
      const incorrect2 = target + (Math.random() > 0.5 ? 2 : -2);
      
      const newOptions = [target, incorrect1, incorrect2 !== incorrect1 ? incorrect2 : incorrect1 + 1];
      setOptions(newOptions.sort(() => Math.random() - 0.5));
      setStartTime(Date.now());
    } else {
      const accuracy = Math.max(0, 1 - (errors / ROUNDS));
      onGameComplete({
        math_accuracy: accuracy,
        counting_accuracy: accuracy,
        math_response_latency: totalReactionTime / ROUNDS
      });
    }
  }, [round, onGameComplete]);

  const handleSelection = (selected: number) => {
    const reactionTime = (Date.now() - startTime) / 1000;

    if (selected === targetNumber) {
      setTotalReactionTime(prev => prev + reactionTime);
      setJumping(true);
      setTimeout(() => {
        setJumping(false);
        setRound(prev => prev + 1);
      }, 1000);
    } else {
      setErrors(prev => prev + 1);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (round >= ROUNDS) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6 relative min-h-[600px] overflow-hidden">
      {/* Animated Water Background (Enhanced) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          className="absolute inset-x-0 bottom-0 h-1/2 bg-sky-400/20 backdrop-blur-sm"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
           <motion.path 
             animate={{ d: [
               "M0,450 Q200,420 400,450 T800,450 L800,600 L0,600 Z",
               "M0,450 Q200,480 400,450 T800,450 L800,600 L0,600 Z",
               "M0,450 Q200,420 400,450 T800,450 L800,600 L0,600 Z"
             ]}}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             fill="#3a86ff"
           />
           <motion.circle cx="10%" cy="15%" r="50" fill="white" animate={{ x: [0, 40, 0], y: [0, 10, 0] }} transition={{ duration: 15, repeat: Infinity }} />
           <motion.circle cx="85%" cy="25%" r="70" fill="white" animate={{ x: [0, -30, 0], y: [0, -15, 0] }} transition={{ duration: 20, repeat: Infinity }} />
        </svg>
      </div>

      <motion.div 
        animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
        className="relative z-10 w-full flex flex-col items-center gap-12"
      >
        <div className="bg-white p-6 md:p-8 flex flex-col items-center border-2 border-sky-50 rounded-[2.5rem] shadow-xl max-w-2xl w-full">
          <h3 className="text-xl md:text-2xl font-black text-sky-900 mb-6 uppercase tracking-tight text-center">
             Jump across the Magic Islands! 🏝️
          </h3>
          <div className="flex items-center gap-4 md:gap-8 p-4 md:p-8 bg-sky-50 rounded-[2rem] border border-sky-100 shadow-inner">
             <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-black text-sky-900 opacity-40">{targetNumber - 2}</span>
                <span className="text-[8px] md:text-[10px] font-bold text-sky-400 mt-1 uppercase tracking-widest">Start</span>
             </div>
             <span className="text-xl md:text-2xl text-sky-200">➜</span>
             <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-black text-sky-900 opacity-70">{targetNumber - 1}</span>
                <span className="text-[8px] md:text-[10px] font-bold text-sky-400 mt-1 uppercase tracking-widest">Next</span>
             </div>
             <span className="text-xl md:text-2xl text-sky-200">➜</span>
             <motion.div 
               className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white"
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ repeat: Infinity, duration: 2 }}
             >
                <span className="text-2xl md:text-3xl font-black text-white">?</span>
             </motion.div>
          </div>
        </div>


        
        <div className="flex flex-wrap justify-center gap-8 max-w-3xl">
          <AnimatePresence mode="popLayout">
            {!jumping && options.map((option, idx) => (
              <motion.button
                key={`${round}-${idx}`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                whileHover={{ y: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelection(option)}
                className="relative group h-32 w-32 md:h-44 md:w-44"
              >
                <div className="absolute inset-2 md:inset-4 bg-gradient-to-b from-sky-400 to-indigo-600 border-4 border-white rounded-full flex flex-col items-center justify-center shadow-xl group-hover:from-amber-400 group-hover:scale-105 transition-all">
                   <span className="text-4xl md:text-6xl font-black text-white">{option}</span>
                </div>
                <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl">🌴</div>
              </motion.button>



            ))}
          </AnimatePresence>
        </div>
      </motion.div>

        {/* Jumping Mascot Animation */}
        <AnimatePresence>
          {jumping && (
            <motion.div 
               initial={{ x: -200, y: 100, scale: 0.5, rotate: -45 }}
               animate={{ 
                 x: [0, 0], 
                 y: [-250, 0],
                 scale: [1, 1.2, 1],
                 rotate: [0, 0]
               }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="absolute text-9xl z-50 pointer-events-none"
            >
              🐸
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
}
