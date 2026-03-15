'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FocusCatcherProps {
  onGameComplete: (stats: { attention_score: number; impulsive_click_rate: number; missed_targets: number; reaction_time: number }) => void;
}

const ROUNDS = 5;

// Star is target, Bug is distraction
type EntityType = 'star' | 'bug';
interface Entity {
  id: number;
  type: EntityType;
  x: number;
  y: number;
  duration: number;
}

export default function FocusCatcherGame({ onGameComplete }: FocusCatcherProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [round, setRound] = useState(0);
  
  // Stats
  const [caughtTargets, setCaughtTargets] = useState(0);
  const [missedTargets, setMissedTargets] = useState(0);
  const [distractionClicks, setDistractionClicks] = useState(0);
  const [totalReactionTime, setTotalReactionTime] = useState(0);
  
  const [lastSpawnTime, setLastSpawnTime] = useState(Date.now());

  useEffect(() => {
    if (round >= ROUNDS * 3) {
      const impulsiveRate = distractionClicks / Math.max(1, (caughtTargets + distractionClicks));
      const attentionScore = caughtTargets / (ROUNDS * 3);
      onGameComplete({
        attention_score: attentionScore,
        impulsive_click_rate: impulsiveRate,
        missed_targets: missedTargets,
        reaction_time: totalReactionTime / Math.max(1, caughtTargets)
      });
      return;
    }

    const timer = setTimeout(() => {
      // Spawn a new entity
      const isTarget = Math.random() > 0.4;
      const newEntity: Entity = {
        id: Date.now(),
        type: isTarget ? 'star' : 'bug',
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 80 + 10,
        duration: isTarget ? 1500 : 2000 // Stars disappear faster
      };
      
      setEntities(prev => [...prev, newEntity]);
      setLastSpawnTime(Date.now());
      setRound(prev => prev + 1);

      // Despawn entity after duration
      setTimeout(() => {
        setEntities(prev => {
          const stillExists = prev.find(e => e.id === newEntity.id);
          if (stillExists && newEntity.type === 'star') {
            setMissedTargets(m => m + 1);
          }
          return prev.filter(e => e.id !== newEntity.id);
        });
      }, newEntity.duration);

    }, Math.random() * 1000 + 500); // 0.5s to 1.5s delay between spawns

    return () => clearTimeout(timer);
  }, [round]);

  const handleCatch = (id: number, type: EntityType) => {
    const reactionTime = (Date.now() - lastSpawnTime) / 1000;
    
    if (type === 'star') {
      setCaughtTargets(prev => prev + 1);
      setTotalReactionTime(prev => prev + reactionTime);
    } else {
      setDistractionClicks(prev => prev + 1);
    }
    
    setEntities(prev => prev.filter(e => e.id !== id));
  };

  if (round >= ROUNDS * 3 && entities.length === 0) return null;

  return (
    <div className="w-full h-full relative p-4 bg-slate-900 rounded-2xl overflow-hidden shadow-inner cursor-crosshair">
      <h3 className="absolute top-4 left-4 z-10 text-white/50 text-xl font-bold tracking-widest">
        CATCH THE STARS ✨
      </h3>
      <AnimatePresence>
        {entities.map((entity) => (
          <motion.div
            key={entity.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => handleCatch(entity.id, entity.type)}
            className="absolute flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90"
            style={{ 
              left: `${entity.x}%`, 
              top: `${entity.y}%`,
              transform: 'translate(-50%, -50%)' 
            }}
          >
            {entity.type === 'star' ? (
              <span className="text-5xl drop-shadow-[0_0_15px_rgba(252,211,77,0.8)]">⭐</span>
            ) : (
              <span className="text-5xl drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">🪲</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
