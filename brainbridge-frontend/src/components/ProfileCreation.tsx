'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProfileProps {
  onCreate: (childId: string) => void;
}

export default function ProfileCreation({ onCreate }: ProfileProps) {
  const [childId, setChildId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (childId.trim()) {
      onCreate(childId.trim());
    } else {
      // Auto-generate random ID for hackathon speed
      onCreate('child_' + Math.floor(Math.random() * 100000));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-[4rem] p-12 max-w-md w-full mx-auto shadow-[0_40px_120px_rgba(0,0,0,0.3)]"
    >
      <h2 className="text-5xl font-black text-white mb-10 text-center tracking-tighter uppercase drop-shadow-xl">
        Kid Details
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-4">
          <label className="block text-white/80 font-black ml-4 uppercase tracking-widest text-xs">
            Nickname or ID
          </label>
          <input 
            type="text"
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            placeholder="Type here..."
            className="w-full glass-card bg-white/20 border-2 border-white/30 rounded-[2rem] px-10 py-6 text-2xl focus:outline-none focus:border-white focus:bg-white/30 transition-all text-white placeholder-white/40 font-black"
          />
        </div>
        
        <button 
          type="submit"
          className="creative-btn bg-white text-vibrantPink hover:bg-white/90 shadow-xl w-full py-6 text-2xl tracking-tight uppercase flex items-center justify-center gap-4"
        >
          LET'S PLAY! <span className="text-3xl">🎮</span>
        </button>
      </form>
    </motion.div>
  );
}
