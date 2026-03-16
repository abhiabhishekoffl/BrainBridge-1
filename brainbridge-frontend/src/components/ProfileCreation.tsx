'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import InteractiveMascot from './InteractiveMascot';

interface ProfileProps {
  onCreate: (childId: string) => void;
}

export default function ProfileCreation({ onCreate }: ProfileProps) {
  const [childId, setChildId] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const avatars = [
    { icon: '🚀', color: 'bg-sky-400' },
    { icon: '🐙', color: 'bg-rose-400' },
    { icon: '🦖', color: 'bg-emerald-400' },
    { icon: '🤖', color: 'bg-indigo-500' },
    { icon: '🦊', color: 'bg-amber-400' },
    { icon: '🐼', color: 'bg-white' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (childId.trim()) {
      onCreate(childId.trim());
    } else {
      onCreate('Explorer_' + Math.floor(Math.random() * 1000));
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-2xl mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white/70 backdrop-blur-md w-full p-12 md:p-20 relative overflow-hidden shadow-2xl border border-white/80 rounded-[3rem]"
      >
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
             animate={{ scale: [1, 1.05, 1] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className="w-32 h-32 mb-12 flex items-center justify-center"
          >
            <InteractiveMascot className="w-full h-full" />
          </motion.div>


          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 text-center tracking-tight uppercase">
            Start Your Journey! 🌟
          </h2>
          
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-12">
            {/* Avatar Selection */}
            <div className="w-full">
              <label className="block text-slate-400 font-bold text-xs uppercase tracking-widest mb-8 text-center">
                 Pick Your Adventure Hero
              </label>
              <div className="flex flex-wrap justify-center gap-5">
                 {avatars.map((avatar, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedAvatar(idx)}
                      className={`w-20 h-20 rounded-2xl text-4xl flex items-center justify-center transition-all border-2 border-white
                        ${selectedAvatar === idx 
                          ? `${avatar.color} text-white ring-4 ring-offset-4 ring-indigo-200 scale-110 shadow-lg` 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-400'
                        }
                      `}
                    >
                      {avatar.icon}
                    </motion.button>
                 ))}
              </div>
            </div>

            <div className="w-full space-y-4">
              <label className="block text-slate-400 font-bold text-xs uppercase tracking-widest ml-6">
                What&apos;s Your Explorer Name?
              </label>
              <div className="relative group">
                <input 
                  type="text"
                  value={childId}
                  onChange={(e) => setChildId(e.target.value)}
                  placeholder="Type your name here..."
                  className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2rem] px-10 py-8 text-3xl focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-slate-800 placeholder-slate-200 font-bold"
                />
              </div>
            </div>
            
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-8 text-3xl font-black group shadow-xl shadow-indigo-600/20 rounded-[2.5rem] uppercase tracking-widest"
            >
              LET&apos;S PLAY! <span className="ml-4 animate-bounce-soft">🚀</span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
