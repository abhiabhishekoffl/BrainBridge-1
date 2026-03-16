'use client';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../stores/languageStore';
import InteractiveMascot from './InteractiveMascot';

interface ConsentProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Consent({ onConfirm, onCancel }: ConsentProps) {
  const { t } = useLanguageStore();

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-2xl mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel w-full p-12 md:p-20 relative overflow-hidden shadow-2xl border-white/80"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
             animate={{ y: [0, -8, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="w-32 h-32 mb-12 flex items-center justify-center"
          >
            <InteractiveMascot className="w-full h-full" />
          </motion.div>


          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 text-center tracking-tight uppercase">
             {t('consent.title') || "Mission Briefing"} 🌟
          </h2>
          
          <div className="bg-white/50 backdrop-blur-sm p-10 md:p-12 rounded-[3rem] mb-12 border border-white/80 shadow-sm">
            <p className="text-slate-600 text-xl md:text-2xl leading-relaxed text-center font-semibold">
              {t('consent.text') || "Ready to join the BrainBridge explorers? We'll play some fun games together to find your unique magic powers!"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <motion.button 
              onClick={onConfirm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary py-8 text-2xl font-bold group rounded-[2rem]"
            >
              {t('consent.agree') || "Let's Go!"} 
            </motion.button>
            <motion.button 
              onClick={onCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-100 text-slate-400 hover:bg-slate-200 py-8 rounded-[2rem] text-xl font-bold transition-all border border-slate-200"
            >
              {t('consent.disagree') || "Not Now"}
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      <p className="text-sm text-white/50 font-black uppercase tracking-[0.4em] text-center max-w-xl bg-black/5 px-8 py-4 rounded-full">
        Your privacy is our priority. No data is shared without your permission.
      </p>
    </div>
  );
}
