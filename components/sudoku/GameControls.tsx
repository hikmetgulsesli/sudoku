'use client';

import { cn } from '@/lib/utils';
import { Difficulty } from '@/types/sudoku';
import { Play, Pause, RotateCcw, Clock, Trophy } from 'lucide-react';

interface GameControlsProps {
  timer: string;
  gameStatus: 'idle' | 'playing' | 'paused' | 'won';
  difficulty: Difficulty;
  onPauseToggle: () => void;
  onNewGame: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export function GameControls({
  timer,
  gameStatus,
  difficulty,
  onPauseToggle,
  onNewGame,
  onDifficultyChange,
}: GameControlsProps) {
  const isPaused = gameStatus === 'paused';
  const isWon = gameStatus === 'won';

  return (
    <div className="w-full max-w-[468px] space-y-4">
      {/* Timer and Status Row */}
      <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xl font-semibold',
            isWon ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-200'
          )}>
            <Clock className="w-5 h-5" />
            {timer}
          </div>
          {isWon && (
            <div className="flex items-center gap-1.5 text-green-400">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold text-sm">Completed!</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPauseToggle}
            disabled={gameStatus === 'idle' || isWon}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer',
              'focus-visible:ring-2 focus-visible:ring-blue-400 outline-none',
              isPaused
                ? 'bg-green-600 text-white hover:bg-green-500'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600',
              (gameStatus === 'idle' || isWon) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            )}
          </button>

          <button
            onClick={onNewGame}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer',
              'bg-blue-600 text-white hover:bg-blue-500',
              'focus-visible:ring-2 focus-visible:ring-blue-400 outline-none'
            )}
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </button>
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="flex items-center justify-center gap-2">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
          <button
            key={diff}
            onClick={() => onDifficultyChange(diff)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer capitalize',
              'focus-visible:ring-2 focus-visible:ring-blue-400 outline-none',
              difficulty === diff
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            )}
          >
            {diff}
          </button>
        ))}
      </div>
    </div>
  );
}
