import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Difficulty } from "@/types/sudoku";

interface HeaderProps {
  title?: string;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  timer: string;
  onPause?: () => void;
  onSettings?: () => void;
  className?: string;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function Header({
  title = "Sudoku",
  difficulty,
  onDifficultyChange,
  timer,
  onPause,
  onSettings,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-3 sm:py-4",
        "flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-primary text-xl sm:text-2xl">◆</span>
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-primary tracking-tight">
          {title}
        </h1>
      </div>

      {/* Center: Difficulty & Timer */}
      <div className="flex items-center gap-4 sm:gap-6 order-3 sm:order-2">
        {/* Difficulty Badge/Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Difficulty:
          </span>
          <Select
            value={difficulty}
            onValueChange={(value) => onDifficultyChange(value as Difficulty)}
          >
            <SelectTrigger
              className="w-[120px] sm:w-[140px] h-9 bg-primary text-primary-foreground border-0 font-medium text-xs sm:text-sm cursor-pointer hover:bg-primary/90 transition-colors"
              aria-label="Select difficulty"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy" className="cursor-pointer">
                {difficultyLabels.easy}
              </SelectItem>
              <SelectItem value="medium" className="cursor-pointer">
                {difficultyLabels.medium}
              </SelectItem>
              <SelectItem value="hard" className="cursor-pointer">
                {difficultyLabels.hard}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Timer Display */}
        <div
          className="font-heading text-lg sm:text-xl font-semibold bg-muted px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg tabular-nums min-w-[80px] sm:min-w-[100px] text-center"
          aria-label="Game timer"
          aria-live="polite"
        >
          {timer}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 order-2 sm:order-3">
        <button
          onClick={onSettings}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-border bg-card hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
            aria-hidden="true"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
        <button
          onClick={onPause}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-border bg-card hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Pause game"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
            aria-hidden="true"
          >
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
