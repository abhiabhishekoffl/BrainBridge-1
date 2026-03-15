'use client';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../stores/languageStore';

interface ReportCardProps {
  results: {
    adhd_risk: number;
    dyslexia_risk: number;
    dyscalculia_risk: number;
  };
  onRestart: () => void;
}

const getRiskColor = (score: number) => {
  if (score < 0.3) return 'bg-emerald-500 text-white';
  if (score < 0.6) return 'bg-amber-400 text-slate-900';
  return 'bg-red-500 text-white';
};

const getRiskLabel = (score: number, t: (key: string) => string) => {
  if (score < 0.3) return t('report.low');
  if (score < 0.6) return t('report.moderate');
  return t('report.high');
};

export default function ReportCard({ results, onRestart }: ReportCardProps) {
  const { t } = useLanguageStore();

  const metrics = [
    { key: 'adhd_risk', label: t('report.adhd_risk'), score: results.adhd_risk },
    { key: 'dyslexia_risk', label: t('report.dyslexia_risk'), score: results.dyslexia_risk },
    { key: 'dyscalculia_risk', label: t('report.dyscalculia_risk'), score: results.dyscalculia_risk },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel rounded-[4rem] p-12 max-w-3xl w-full mx-auto relative overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.4)]"
    >
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full animate-blob"></div>
      
      <h2 className="text-6xl font-black text-white mb-12 text-center tracking-tighter leading-none drop-shadow-2xl">
        {t('report.title').split(' ').map((word, i) => (
          <span key={i} className={i % 2 === 1 ? "text-white" : "text-white/60"}>
            {word}{' '}
          </span>
        ))}
      </h2>
      
      <div className="grid gap-8 mb-14">
        {metrics.map(m => (
          <div key={m.key} className="flex items-center justify-between p-8 glass-card rounded-[2.5rem] border-white/30 group hover:bg-white/10 transition-all duration-300">
            <span className="font-black text-2xl text-white tracking-tight">{m.label}</span>
            <div className={`px-8 py-3 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl transform transition-transform group-hover:scale-110 ${getRiskColor(m.score)}`}>
              {getRiskLabel(m.score, t)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black/20 backdrop-blur-xl p-8 rounded-[2rem] mb-14 border border-white/10">
        <p className="text-[0.75rem] text-white/50 text-center uppercase tracking-[0.3em] font-black leading-loose">
          {t('report.disclaimer')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button className="creative-btn bg-white text-vibrantPink hover:bg-white/90 shadow-2xl py-6 text-xl flex justify-center items-center gap-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          SAVE PDF
        </button>
        <button 
          onClick={onRestart}
          className="creative-btn bg-black/20 text-white hover:bg-black/30 py-6 text-xl font-black border border-white/20"
        >
          ANOTHER GO? 🚀
        </button>
      </div>
    </motion.div>
  );
}
