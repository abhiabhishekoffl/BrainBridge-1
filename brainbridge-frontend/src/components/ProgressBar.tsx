'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-6">
      <div 
        className="bg-indigo-500 h-full transition-all duration-500 ease-out flex items-center justify-end px-2"
        style={{ width: `${percentage}%` }}
      >
        <div className="w-2 h-2 bg-white rounded-full opacity-50 shadow-sm" />
      </div>
    </div>
  );
}
