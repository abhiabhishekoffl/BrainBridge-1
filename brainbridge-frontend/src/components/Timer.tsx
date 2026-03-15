'use client';
import { useEffect, useState } from 'react';
import { useLanguageStore } from '../stores/languageStore';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isRunning: boolean;
}

export default function Timer({ duration, onTimeUp, isRunning }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const { t } = useLanguageStore();

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, timeLeft, onTimeUp]);

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 36}
            strokeDashoffset={2 * Math.PI * 36 * ((100 - percentage) / 100)}
            className={`transition-all duration-1000 linear ${timeLeft <= 10 ? 'text-red-500' : 'text-indigo-500'}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-gray-800">
          {timeLeft}
        </div>
      </div>
      <span className="text-sm font-medium text-gray-500 mt-2">{t('shell.time_remaining')}</span>
    </div>
  );
}
