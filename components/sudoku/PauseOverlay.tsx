'use client';

import { Pause } from 'lucide-react';

export function PauseOverlay() {
  return (
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10 animate-in fade-in duration-200">
      <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
        <Pause className="w-8 h-8 text-slate-200" />
      </div>
      <h3 className="text-2xl font-bold text-slate-100 mb-2">Game Paused</h3>
      <p className="text-slate-400 text-center px-4">
        Click the Resume button to continue playing
      </p>
    </div>
  );
}
