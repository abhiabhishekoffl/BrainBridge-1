'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FocusCatcherProps {
  onGameComplete: (stats: { 
    attention_score: number; 
    impulsive_click_rate: number; 
    missed_targets: number; 
    reaction_time: number 
  }) => void;
}

const GAME_DURATION_SECONDS = 30; // Shorter bursts are better for kids

type EntityType = 'butterfly' | 'meteor';
interface Entity {
  id: number;
  type: EntityType;
  x: number;
  y: number;
  scale: number;
}

export default function FocusCatcherGame({ onGameComplete }: FocusCatcherProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lastCaught, setLastCaught] = useState<{ x: number, y: number, type: EntityType } | null>(null);

  // Stats for the parent/callback
  const [stats, setStats] = useState({
    caught: 0,
    missed: 0,
    distractions: 0,
    totalReactionTime: 0
  });

  const [lastSpawnTime, setLastSpawnTime] = useState(Date.now());

  // Handle Game End
  const finishGame = useCallback(() => {
    setIsGameOver(true);
    const totalPossible = stats.caught + stats.missed;
    onGameComplete({
      attention_score: stats.caught / Math.max(1, totalPossible),
      impulsive_click_rate: stats.distractions / Math.max(1, (stats.caught + stats.distractions)),
      missed_targets: stats.missed,
      reaction_time: stats.totalReactionTime / Math.max(1, stats.caught)
    });
  }, [stats, onGameComplete]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) {
      finishGame();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finishGame]);

  // Spawning Logic
  useEffect(() => {
    if (isGameOver) return;

    const spawnInterval = Math.random() * 800 + 400; // Faster spawns for engagement
    const timer = setTimeout(() => {
      const isTarget = Math.random() > 0.3;
      const newEntity: Entity = {
        id: Date.now(),
        type: isTarget ? 'butterfly' : 'meteor',
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
        scale: Math.random() * 0.5 + 0.8
      };

      setEntities(prev => [...prev, newEntity]);
      setLastSpawnTime(Date.now());

      // Despawn logic
      setTimeout(() => {
        setEntities(prev => {
          const exists = prev.find(e => e.id === newEntity.id);
          if (exists && newEntity.type === 'butterfly') {
            setStats(s => ({ ...s, missed: s.missed + 1 }));
            setCombo(0); // Reset combo on miss
          }
          return prev.filter(e => e.id !== newEntity.id);
        });
      }, 2000);

    }, spawnInterval);

    return () => clearTimeout(timer);
  }, [entities, isGameOver]);

  const handleCatch = (id: number, type: EntityType, x: number, y: number) => {
    const reactionTime = (Date.now() - lastSpawnTime) / 1000;
    setLastCaught({ x, y, type });
    setTimeout(() => setLastCaught(null), 600);

    if (type === 'butterfly') {
      setScore(prev => prev + (10 * (combo + 1)));
      setCombo(prev => prev + 1);
      setStats(s => ({ ...s, caught: s.caught + 1, totalReactionTime: s.totalReactionTime + reactionTime }));
    } else {
      setScore(prev => Math.max(0, prev - 20));
      setCombo(0);
      setStats(s => ({ ...s, distractions: s.distractions + 1 }));
    }
    setEntities(prev => prev.filter(e => e.id !== id));
  };

  if (isGameOver) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[600px] p-4 bg-indigo-950 font-sans">
      
      {/* Top HUD */}
      <div className="w-full max-w-4xl flex justify-between items-end mb-4 px-6">
        <div className="flex flex-col">
          <span className="text-indigo-300 text-xs font-bold uppercase tracking-tighter">Magic Score</span>
          <motion.div 
            key={score}
            initial={{ scale: 1.2, color: '#fff' }}
            animate={{ scale: 1, color: '#fbbf24' }}
            className="text-4xl md:text-5xl font-black text-amber-400 drop-shadow-lg"
          >
            {score}
          </motion.div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-32 md:w-48 h-4 bg-indigo-900 rounded-full overflow-hidden border-2 border-indigo-400">
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-500 to-yellow-400"
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / GAME_DURATION_SECONDS) * 100}%` }}
            />
          </div>
          <span className="text-white font-bold mt-1 text-sm">Time: {timeLeft}s</span>
        </div>

        <div className="text-right">
          <span className="text-indigo-300 text-xs font-bold uppercase tracking-tighter">Combo</span>
          <div className="text-3xl md:text-4xl font-black text-pink-500 tracking-tighter">
            x{combo}
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="relative w-full max-w-4xl aspect-[16/10] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.4)] border-4 border-indigo-500/30 group cursor-none">
        
        {/* Animated Background Layers */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b, #0f172a)]" />
          
          {/* Parallax Stars */}
          {[...Array(20)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute bg-white rounded-full opacity-20"
              style={{ 
                width: Math.random() * 4 + 'px', 
                height: Math.random() * 4 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
              animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.5, 1] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
            />
          ))}

          {/* Glowing Nebula */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full"
          />
        </div>

        {/* Game Entities */}
        <AnimatePresence>
          {entities.map((entity) => (
            <motion.div
              key={entity.id}
              initial={{ scale: 0, opacity: 0, rotate: -20 }}
              animate={{ scale: entity.scale, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, y: -20 }}
              whileHover={{ scale: entity.scale + 0.1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => handleCatch(entity.id, entity.type, entity.x, entity.y)}
              className="absolute p-4 z-20 select-none touch-none"
              style={{ left: `${entity.x}%`, top: `${entity.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {entity.type === 'butterfly' ? (
                <div className="relative cursor-pointer group">
                  {/* Butterfly Wings Animation */}
                  <motion.div 
                    animate={{ rotateY: [0, 60, 0] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                    className="text-6xl md:text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  >
                    🦋
                  </motion.div>
                  {/* Catch Prompt for kids */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm px-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-[10px] text-white font-bold">TAP!</span>
                  </div>
                </div>
              ) : (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="text-5xl md:text-6xl filter grayscale-[0.5] opacity-80"
                >
                   🪨
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Catch/Miss Feedback */}
        <AnimatePresence>
          {lastCaught && (
            <motion.div 
              initial={{ y: 0, opacity: 0, scale: 0.5 }}
              animate={{ y: -60, opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className="absolute z-50 pointer-events-none font-black text-4xl"
              style={{ left: `${lastCaught.x}%`, top: `${lastCaught.y}%`, transform: 'translateX(-50%)' }}
            >
              {lastCaught.type === 'butterfly' ? (
                <span className="text-yellow-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">✨ AWESOME!</span>
              ) : (
                <span className="text-red-500 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">OOPS! ❌</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructional Overlay (Fades out quickly) */}
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-indigo-900/40 backdrop-blur-sm z-40 pointer-events-none"
        >
          <div className="text-center">
            <h2 className="text-4xl font-black text-white mb-2">READY?</h2>
            <p className="text-indigo-200 font-bold">Catch the 🦋. Avoid the 🪨!</p>
          </div>
        </motion.div>
      </div>
      
      <p className="mt-6 text-indigo-300/60 text-sm font-medium">Focus and react quickly to boost your score!</p>
    </div>
  );
}