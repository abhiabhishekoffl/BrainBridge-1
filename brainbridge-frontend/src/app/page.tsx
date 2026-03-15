'use client';
import { useState } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';

import { useSessionStore } from '../stores/sessionStore';
import { useTelemetryStore } from '../stores/telemetryStore';
import { useLanguageStore } from '../stores/languageStore';

import LanguageToggle from '../components/LanguageToggle';
import Landing from '../components/Landing';
import Consent from '../components/Consent';
import ProfileCreation from '../components/ProfileCreation';
import GameShell from '../components/GameShell';
import ReportCard from '../components/ReportCard';

import LetterMirrorGame from '../games/letterMirror/LetterMirrorGame';
import NumberJumpGame from '../games/numberJump/NumberJumpGame';
import FocusCatcherGame from '../games/focusCatcher/FocusCatcherGame';

type FlowState = 'landing' | 'consent' | 'profile' | 'playing' | 'loading_results' | 'report';

const API_BASE_URL = 'http://localhost:5000/api'; // Node backend

export default function Home() {
  const [flow, setFlow] = useState<FlowState>('landing');
  const [results, setResults] = useState<any>(null);
  
  const { sessionId, setSession, currentGameIndex, nextGame, resetSession } = useSessionStore();
  const { addTelemetry, clearTelemetry, data: telemetryData } = useTelemetryStore();

  const handleStart = () => setFlow('consent');
  const handleConsent = () => setFlow('profile');
  const handleCancel = () => setFlow('landing');
  
  const handleProfileCreate = async (childId: string) => {
    try {
      // 1. Create Session backend call
      const res = await axios.post(`${API_BASE_URL}/sessions`, { child_id: childId, language: 'en' });
      setSession(res.data._id, childId);
      setFlow('playing');
    } catch (e) {
      console.error('Failed to create session, running locally mode fallback.', e);
      setSession('local_' + Date.now(), childId);
      setFlow('playing');
    }
  };

  const submitTelemetry = async (gameName: string, stats: any) => {
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
        // Mock result for offline mode
        setTimeout(() => {
          setResults({ adhd_risk: 0.2, dyslexia_risk: 0.1, dyscalculia_risk: 0.05 });
          setFlow('report');
        }, 1500);
        return;
      }
      
      const res = await axios.post(`${API_BASE_URL}/predict`, { session_id: sessionId });
      setResults(res.data);
      setFlow('report');
    } catch (e) {
      console.error('Prediction failed.', e);
      setResults({ adhd_risk: 0.5, dyslexia_risk: 0.5, dyscalculia_risk: 0.5 });
      setFlow('report');
    }
  };

  const handleGameComplete = (gameName: string, stats: any) => {
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

  const { t } = useLanguageStore();

  const resetApp = () => {
    resetSession();
    clearTelemetry();
    setResults(null);
    setFlow('landing');
  };

  return (
    <main className="w-full h-screen overflow-x-hidden relative bg-slate-50 font-sans">
      <div className="relative z-10 w-full min-h-full flex flex-col">
        {/* Header/Navbar */}
        <header className="w-full max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg transform -rotate-12 transition-transform hover:rotate-0">
               <span className="text-white text-xl font-bold">B</span>
            </div>
            <h1 className="text-2xl font-black text-primary tracking-tight">BrainBridge</h1>
          </div>
          <div className="flex gap-4">
            <LanguageToggle />
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center p-4">
          <AnimatePresence mode="wait">
            {flow === 'landing' && <Landing key="landing" onStart={handleStart} />}
            {flow === 'consent' && <Consent key="consent" onConfirm={handleConsent} onCancel={handleCancel} />}
            {flow === 'profile' && <ProfileCreation key="profile" onCreate={handleProfileCreate} />}
            {flow === 'playing' && (
              <div key="playing" className="w-full h-full max-w-lg mx-auto py-8">
                {renderGame()}
              </div>
            )}
            {flow === 'loading_results' && (
              <div key="loading" className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6 shadow-2xl" />
                <h2 className="text-3xl font-black text-slate-800">Analyzing Screening Results...</h2>
                <p className="text-slate-500 mt-2 font-medium">Generating personalized report...</p>
              </div>
            )}
            {flow === 'report' && results && (
              <div key="report" className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar px-2 rounded-3xl">
                <ReportCard results={results} onRestart={resetApp} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="w-full py-8 text-center text-slate-400 font-bold tracking-widest text-xs">
          BRAINBRIDGE | PWA | (C) 2024
        </footer>
      </div>
    </main>
  );
}
