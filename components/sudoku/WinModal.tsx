'use client';

import { cn } from '@/lib/utils';
import { Trophy, X, RotateCcw } from 'lucide-react';

interface WinModalProps {
  isOpen: boolean;
  completionTime: string;
  onClose: () => void;
  onNewGame: () => void;
}

export function WinModal({ isOpen, completionTime, onClose, onNewGame }: WinModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in duration-200">
        {/* Trophy Icon */}
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-slate-900" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-slate-100 mb-2">
          Congratulations!
        </h2>
        <p className="text-slate-400 mb-6">
          You completed the puzzle!
        </p>

        {/* Completion Time */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-8">
          <p className="text-slate-400 text-sm mb-1">Completion Time</p>
          <p className="text-4xl font-mono font-bold text-green-400">
            {completionTime}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={cn(
              'flex-1 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer',
              'bg-slate-800 text-slate-300 hover:bg-slate-700',
              'focus-visible:ring-2 focus-visible:ring-blue-400 outline-none'
            )}
          >
            <X className="w-4 h-4 inline mr-2" />
            Close
          </button>
          <button
            onClick={onNewGame}
            className={cn(
              'flex-1 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer',
              'bg-blue-600 text-white hover:bg-blue-500',
              'focus-visible:ring-2 focus-visible:ring-blue-400 outline-none'
            )}
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
