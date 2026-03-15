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
  
  // Stats
  const [startTime, setStartTime] = useState(Date.now());
  const [errors, setErrors] = useState(0);
  const [totalReactionTime, setTotalReactionTime] = useState(0);

  useEffect(() => {
    if (round < ROUNDS) {
      // Generate a simple math problem conceptually represented as jumping to the right number in a sequence
      const target = Math.floor(Math.random() * 8) + 3; // 3 to 10
      setTargetNumber(target);
      
      const incorrect1 = target + (Math.random() > 0.5 ? 1 : -1);
      const incorrect2 = target + (Math.random() > 0.5 ? 2 : -2);
      
      const newOptions = [target, incorrect1, incorrect2 != incorrect1 ? incorrect2 : incorrect1 + 1];
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
  }, [round]);

  const handleSelection = (selected: number) => {
    const reactionTime = (Date.now() - startTime) / 1000;

    if (selected === targetNumber) {
      setTotalReactionTime(prev => prev + reactionTime);
      setRound(prev => prev + 1);
    } else {
      setErrors(prev => prev + 1);
    }
  };

  if (round >= ROUNDS) return null;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h3 className="text-2xl font-bold text-slate-700 mb-2">Jump to the missing number or next in sequence</h3>
      <div className="flex space-x-4 mb-10 text-4xl font-black text-indigo-600">
        <span>{targetNumber - 2}</span>
        <span>,</span>
        <span>{targetNumber - 1}</span>
        <span>,</span>
        <span className="text-emerald-500 border-b-4 border-emerald-500 px-4">?</span>
      </div>
      
      <div className="flex space-x-6">
        <AnimatePresence>
          {options.map((option, idx) => (
            <motion.button
              key={`${round}-${idx}`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ y: -10 }}
              onClick={() => handleSelection(option)}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 text-white text-4xl font-extrabold shadow-lg hover:shadow-cyan-400/50 transition-all flex items-center justify-center"
            >
              {option}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
