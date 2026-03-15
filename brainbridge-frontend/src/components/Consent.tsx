'use client';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../stores/languageStore';

interface ConsentProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Consent({ onConfirm, onCancel }: ConsentProps) {
  const { t } = useLanguageStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel rounded-[3.5rem] p-12 max-w-2xl w-full mx-auto relative overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.3)]"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full animate-blob"></div>
      
      <h2 className="text-5xl font-black text-white mb-10 text-center tracking-tighter drop-shadow-xl uppercase">
        {t('consent.title')}
      </h2>
      <div className="bg-black/10 backdrop-blur-xl p-10 rounded-[2.5rem] mb-12 border border-white/20 shadow-inner">
        <p className="text-white text-xl leading-relaxed text-center font-bold tracking-tight">
          {t('consent.text')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <button 
          onClick={onConfirm}
          className="creative-btn bg-white text-vibrantPink hover:bg-white/90 shadow-white/10 py-6 text-2xl tracking-tighter flex items-center justify-center gap-4 group"
        >
          {t('consent.agree')} <span className="group-hover:translate-x-2 transition-transform">➜</span>
        </button>
        <button 
          onClick={onCancel}
          className="creative-btn bg-black/20 text-white/70 hover:bg-black/30 py-4 text-xl font-black border border-white/10"
        >
          {t('consent.disagree')}
        </button>
      </div>
    </motion.div>
  );
}
