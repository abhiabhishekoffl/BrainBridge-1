'use client';
import { ReactNode } from 'react';
import { useLanguageStore } from '../stores/languageStore';
import ProgressBar from './ProgressBar';
import Timer from './Timer';

interface GameShellProps {
  gameIndex: number;
  totalGames: number;
  timeRemaining: number;
  isRunning: boolean;
  onTimeUp: () => void;
  onExit: () => void;
  children: ReactNode;
}

export default function GameShell({ 
  gameIndex, 
  totalGames, 
  timeRemaining, 
  isRunning, 
  onTimeUp, 
  onExit, 
  children 
}: GameShellProps) {
  const { t } = useLanguageStore();

  return (
    <div className="flex flex-col h-full bg-transparent relative p-6 font-sans">
      {/* Header section with glass effect */}
      <div className="flex justify-between items-center mb-8 glass-card p-8 rounded-[3rem] border-white/30 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Brain<span className="text-white/60">Bridge</span></h2>
          <p className="text-white/70 font-black mt-2 opacity-80 uppercase tracking-[0.3em] text-[0.65rem]">
            {t('shell.game')} {gameIndex + 1} / {totalGames}
          </p>
        </div>
        <button 
          onClick={onExit}
          className="creative-btn bg-white/10 text-white px-8 py-3 rounded-2xl font-black shadow-none hover:bg-white/20 transition-all border border-white/20 uppercase text-xs tracking-widest"
        >
          {t('shell.exit')}
        </button>
      </div>

      <div className="mb-10 scale-95 origin-center">
        <ProgressBar current={gameIndex} total={totalGames} />
      </div>

      <div className="flex justify-center items-center glass-card bg-black/10 p-6 rounded-[2rem] mb-10 border-white/10 shadow-inner">
        <Timer duration={timeRemaining} onTimeUp={onTimeUp} isRunning={isRunning} />
      </div>

      {/* Game Content Area with extreme glass effect */}
      <div className="flex-1 glass-panel bg-white/10 rounded-[4rem] border-white/20 overflow-hidden relative p-12 flex flex-col justify-center shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-white/40 via-white/10 to-transparent"></div>
        {children}
      </div>
    </div>
  );
}
