'use client';
import { useLanguageStore } from '../stores/languageStore';

export default function LanguageToggle() {
  const { toggleLanguage, t } = useLanguageStore();

  return (
    <button 
      onClick={toggleLanguage}
      className="absolute top-8 right-8 z-50 glass-panel px-6 py-3 rounded-2xl font-black text-white hover:bg-white/20 transition-all duration-300 shadow-2xl flex items-center gap-3 hover:scale-110 active:scale-90 border-white/40 group"
    >
      <span className="text-2xl group-hover:rotate-12 transition-transform">🌐</span>
      <span className="tracking-tight uppercase text-sm">
        {t('landing.language_toggle')}
      </span>
    </button>
  );
}
