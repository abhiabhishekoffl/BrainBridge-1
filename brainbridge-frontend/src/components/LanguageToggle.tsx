'use client';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../stores/languageStore';

export default function LanguageToggle() {
  const { toggleLanguage, t } = useLanguageStore();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full font-bold text-black border border-white/20 shadow-sm flex items-center gap-3 transition-all hover:bg-white/20"
    >
      <span className="text-xl">🌐</span>
      <span className="tracking-widest uppercase text-[10px] font-black opacity-80">
        {t('landing.language_toggle') || "EN | HI"}
      </span>
    </motion.button>
  );
}
