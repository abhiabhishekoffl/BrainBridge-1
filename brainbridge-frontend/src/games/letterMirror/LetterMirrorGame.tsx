'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LetterMirrorProps {
  onGameComplete: (stats: { errors: number; reaction_time: number; attempts: number; mirror_error_rate: number }) => void;
}

const ROUNDS = 5;

// Letters commonly confused (b/d, p/q)
const PAIRS = [
  { correct: 'b', incorrect: 'd' },
  { correct: 'd', incorrect: 'b' },
  { correct: 'p', incorrect: 'q' },
  { correct: 'q', incorrect: 'p' },
];

export default function LetterMirrorGame({ onGameComplete }: LetterMirrorProps) {
  const [round, setRound] = useState(0);
  const [targetPair, setTargetPair] = useState(PAIRS[0]);
  const [options, setOptions] = useState<string[]>([]);
  
  // Stats
  const [startTime, setStartTime] = useState(Date.now());
  const [errors, setErrors] = useState(0);
  const [mirrorErrors, setMirrorErrors] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [totalReactionTime, setTotalReactionTime] = useState(0);

  // Initialize round
  useEffect(() => {
    if (round < ROUNDS) {
      const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
      setTargetPair(pair);
      
      // Generate options (1 correct, 3 incorrect/mirrored)
      const newOptions = [pair.correct, pair.incorrect, pair.incorrect, pair.correct === 'b' ? 'q' : 'p'];
      // Shuffle
      setOptions(newOptions.sort(() => Math.random() - 0.5));
      setStartTime(Date.now());
    } else {
      // Game end
      onGameComplete({
        errors,
        reaction_time: totalReactionTime / ROUNDS,
        attempts,
        mirror_error_rate: mirrorErrors / Math.max(1, errors)
      });
    }
  }, [round]);

  const handleSelection = (selected: string) => {
    setAttempts(prev => prev + 1);
    const reactionTime = (Date.now() - startTime) / 1000;

    if (selected === targetPair.correct) {
      setTotalReactionTime(prev => prev + reactionTime);
      setRound(prev => prev + 1);
    } else {
      setErrors(prev => prev + 1);
      if (selected === targetPair.incorrect) {
        setMirrorErrors(prev => prev + 1);
      }
      // Provide visual feedback for error here if needed
    }
  };

  if (round >= ROUNDS) return null;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h3 className="text-3xl font-extrabold text-indigo-800 mb-8 border-b-4 border-indigo-200 pb-2">
        Find the <span className="text-emerald-500 text-5xl mx-2">'{targetPair.correct}'</span>
      </h3>
      
      <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
        <AnimatePresence>
          {options.map((option, idx) => (
            <motion.button
              key={`${round}-${idx}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelection(option)}
              className="bg-white border-4 border-slate-100 shadow-xl rounded-2xl h-32 text-6xl font-bold text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 transition-all font-sans"
            >
              {option}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
