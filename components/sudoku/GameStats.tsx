import * as React from "react";
import { cn } from "@/lib/utils";
import { type Difficulty } from "@/types/sudoku";

interface GameStatsProps {
  timer: string;
  difficulty: Difficulty;
  remainingCells: number;
  totalCells?: number;
  hintsUsed?: number;
  totalHints?: number;
  moves?: number;
  className?: string;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function GameStats({
  timer,
  difficulty,
  remainingCells,
  totalCells = 81,
  hintsUsed = 0,
  totalHints = 3,
  moves = 0,
  className,
}: GameStatsProps) {
  const filledCells = totalCells - remainingCells;
  const progress = Math.round((filledCells / totalCells) * 100);

  return (
    <div
      className={cn(
        "bg-muted rounded-xl p-4 flex flex-col gap-3",
        className
      )}
      role="region"
      aria-label="Game statistics"
    >
      {/* Primary Stats Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-sm text-muted-foreground">Time</span>
          <span className="font-heading font-semibold tabular-nums" aria-live="polite">
            {timer}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
            aria-hidden="true"
          >
            <path d="M12 2v20" />
            <path d="m15 19-3 3-3-3" />
            <path d="m19 9 3 3-3 3" />
            <path d="M2 12h20" />
            <path d="m5 9-3 3 3 3" />
          </svg>
          <span className="text-sm text-muted-foreground">Difficulty</span>
          <span className="font-heading font-semibold">
            {difficultyLabels[difficulty]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
            aria-hidden="true"
          >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
          <span className="text-sm text-muted-foreground">Remaining</span>
          <span className="font-heading font-semibold tabular-nums">
            {remainingCells}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Puzzle completion progress"
          />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums min-w-[40px] text-right">
          {progress}%
        </span>
      </div>

      {/* Secondary Stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
          <span>Hints: {hintsUsed}/{totalHints}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
          <span>Moves: {moves}</span>
        </div>
      </div>
    </div>
  );
}
