'use client';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';


import { useSessionStore } from '../stores/sessionStore';
import { useTelemetryStore } from '../stores/telemetryStore';
import { useAuth } from '../stores/AuthContext';


import dynamic from 'next/dynamic';
import LanguageToggle from '@/components/LanguageToggle';

const Landing = dynamic(() => import('../components/Landing'), { ssr: false });
const Consent = dynamic(() => import('../components/Consent'), { ssr: false });
const ProfileCreation = dynamic(() => import('../components/ProfileCreation'), { ssr: false });
const GameShell = dynamic(() => import('../components/GameShell'), { ssr: false });
const ReportCard = dynamic(() => import('../components/ReportCard'), { ssr: false });
const InteractiveMascot = dynamic(() => import('../components/InteractiveMascot'), { ssr: false });

const LetterMirrorGame = dynamic(() => import('../games/letterMirror/LetterMirrorGame'), { ssr: false });
const NumberJumpGame = dynamic(() => import('../games/numberJump/NumberJumpGame'), { ssr: false });
const FocusCatcherGame = dynamic(() => import('../games/focusCatcher/FocusCatcherGame'), { ssr: false });


type FlowState = 'landing' | 'consent' | 'profile' | 'playing' | 'loading_results' | 'report';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';


interface PredictionResults {
  adhd_risk: number;
  dyslexia_risk: number;
  dyscalculia_risk: number;
}

export default function Home() {
  const [flow, setFlow] = useState<FlowState>('landing');
  const [results, setResults] = useState<PredictionResults | null>(null);
  const { user, loading, logout } = useAuth();


  const { sessionId, setSession, currentGameIndex, nextGame, resetSession } = useSessionStore();
  const { addTelemetry, clearTelemetry } = useTelemetryStore();

  const handleStart = () => setFlow('consent');
  const handleConsent = () => setFlow('profile');
  const handleCancel = () => setFlow('landing');

  const handleProfileCreate = async (childId: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/sessions`, { child_id: childId, language: 'en' });
      setSession(res.data.data._id, childId);
      setFlow('playing');

    } catch (e) {
      console.error('Failed to create session, running locally mode fallback.', e);
      setSession('local_' + Date.now(), childId);
      setFlow('playing');
    }
  };

  const submitTelemetry = async (gameName: string, stats: Record<string, number | string>) => {
    const data = {
      session_id: sessionId,
      game: gameName,
      ...stats
    };

    addTelemetry(data);

    try {
      if (!sessionId?.startsWith('local_')) {
        await axios.post(`${API_BASE_URL}/telemetry`, data);
      }
    } catch (e) {
      console.error('Failed to sync telemetry', e);
    }
  };

  const getPrediction = async () => {
    setFlow('loading_results');
    try {
      if (sessionId?.startsWith('local_')) {
        setTimeout(() => {
          setResults({ adhd_risk: 0.2, dyslexia_risk: 0.1, dyscalculia_risk: 0.05 });
          setFlow('report');
        }, 2000);
        return;
      }

      const res = await axios.post(`${API_BASE_URL}/predict`, { session_id: sessionId });
      setResults(res.data.data);
      setFlow('report');

    } catch (e) {
      console.error('Prediction failed.', e);
      setResults({ adhd_risk: 0.5, dyslexia_risk: 0.5, dyscalculia_risk: 0.5 });
      setFlow('report');
    }
  };

  const handleGameComplete = (gameName: string, stats: Record<string, number | string>) => {
    submitTelemetry(gameName, stats);
    if (currentGameIndex < 2) {
      nextGame();
    } else {
      getPrediction();
    }
  };

  const renderGame = () => {
    switch (currentGameIndex) {
      case 0:
        return (
          <GameShell gameIndex={0} totalGames={3} timeRemaining={60} isRunning={true} onTimeUp={() => handleGameComplete('letter_mirror', { errors: 5, reaction_time: 1.5, attempts: 5, mirror_error_rate: 1.0 })} onExit={() => resetApp()}>
            <LetterMirrorGame onGameComplete={(stats) => handleGameComplete('letter_mirror', stats)} />
          </GameShell>
        );
      case 1:
        return (
          <GameShell gameIndex={1} totalGames={3} timeRemaining={60} isRunning={true} onTimeUp={() => handleGameComplete('number_jump', { math_accuracy: 0.5, math_response_latency: 1.5, counting_accuracy: 0.5 })} onExit={() => resetApp()}>
            <NumberJumpGame onGameComplete={(stats) => handleGameComplete('number_jump', stats)} />
          </GameShell>
        );
      case 2:
        return (
          <GameShell gameIndex={2} totalGames={3} timeRemaining={60} isRunning={true} onTimeUp={() => handleGameComplete('focus_catcher', { attention_score: 0, impulsive_click_rate: 1, missed_targets: 10, reaction_time: 2 })} onExit={() => resetApp()}>
            <FocusCatcherGame onGameComplete={(stats) => handleGameComplete('focus_catcher', stats)} />
          </GameShell>
        );
      default:
        return null;
    }
  };

  const resetApp = () => {
    resetSession();
    clearTelemetry();
    setResults(null);
    setFlow('landing');
  };

  return (
    <main className="w-full min-h-screen overflow-x-hidden relative bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Global Atmospheric Background (Adventure Theme) */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-indigo-200/20 blur-[120px] rounded-full animate-blob" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-rose-200/20 blur-[120px] rounded-full animate-blob [animation-delay:3s]" />
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-amber-200/15 blur-[100px] rounded-full animate-blob [animation-delay:6s]" />


        {/* Magic Floating Elements */}
        <motion.div
          animate={{ rotate: 360, y: [0, -20, 0] }}
          transition={{ rotate: { duration: 40, repeat: Infinity, ease: "linear" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute top-[15%] right-[15%] text-6xl opacity-20 floating-icon"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[25%] left-[10%] text-7xl opacity-20 floating-icon"
        >
          🚀
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[5%] text-5xl opacity-15"
        >
          🎨
        </motion.div>
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Sleek Navigation */}
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 lg:py-10 flex flex-wrap justify-between items-center bg-white/30 backdrop-blur-md rounded-b-[2.5rem] mt-0 shadow-sm border-b border-white/40 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 sm:gap-4 cursor-pointer group"
            onClick={resetApp}
          >
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 transform rotate-3 transition-transform group-hover:rotate-0">
              <span className="text-white text-xl sm:text-2xl font-black">B</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">BrainBridge</h1>
              <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1 hidden sm:block">Adventure Mode</span>
            </div>
          </motion.div>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <LanguageToggle />
            {loading ? (
              <div className="w-20 h-8 bg-slate-200 animate-pulse rounded-full" />
            ) : user ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-slate-900 text-sm hidden sm:inline">{user.username}</span>
                <button
                  onClick={logout}
                  className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 ml-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:flex px-6 py-2.5 text-slate-600 font-bold text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors"
                  >
                    Register
                  </motion.button>
                </Link>
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:flex px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-indigo-500/10 transition-all border border-slate-800"
                  >
                    Login
                  </motion.button>
                </Link>
              </div>

            )}
          </div>

        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10">
          <AnimatePresence mode="wait">
            {flow === 'landing' && <Landing key="landing" onStart={handleStart} />}
            {flow === 'consent' && <Consent key="consent" onConfirm={handleConsent} onCancel={handleCancel} />}
            {flow === 'profile' && <ProfileCreation key="profile" onCreate={handleProfileCreate} />}
            {flow === 'playing' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="w-full max-w-7xl mx-auto"
              >
                {renderGame()}
              </motion.div>
            )}
            {flow === 'loading_results' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center glass-panel p-16 md:p-24 border-white/80 max-w-3xl shadow-2xl relative overflow-hidden"
              >
                {/* Decorative particles */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-10 left-10 text-4xl opacity-20">⭐</motion.div>
                  <motion.div animate={{ y: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute bottom-10 right-10 text-4xl opacity-20">💎</motion.div>
                </div>

                <div className="relative w-40 h-40 mb-12">
                  <div className="absolute inset-0 border-8 border-indigo-100 rounded-full" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-8 border-indigo-600 border-t-transparent rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="scale-125">
                      <InteractiveMascot />
                    </div>
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 text-center">Magical Report Pending...</h2>
                <p className="text-slate-500 text-lg font-medium text-center max-w-sm leading-relaxed">Gathering your achievements from the adventure worlds!</p>
              </motion.div>
            )}
            {flow === 'report' && results && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-7xl"
              >
                <ReportCard results={results} onRestart={resetApp} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Footer */}
        <footer className="w-full py-12 px-6 max-w-7xl mx-auto border-t border-slate-200 mt-12 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xs">B</div>
              <span className="font-bold text-slate-900 uppercase tracking-widest text-xs">BrainBridge Adventures Mode</span>
            </div>

            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-6 md:mt-0">
              © 2026 BrainBridge Team
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
