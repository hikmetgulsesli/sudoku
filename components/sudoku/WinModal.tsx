import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Difficulty } from "@/types/sudoku";

interface WinModalProps {
  isOpen: boolean;
  time: string;
  difficulty: Difficulty;
  hintsUsed: number;
  totalHints: number;
  moves: number;
  isNewRecord?: boolean;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  className?: string;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function WinModal({
  isOpen,
  time,
  difficulty,
  hintsUsed,
  totalHints,
  moves,
  isNewRecord = false,
  onPlayAgain,
  onMainMenu,
  className,
}: WinModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300",
        "motion-reduce:animate-none"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-title"
      aria-describedby="win-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onMainMenu}
        aria-hidden="true"
      />

      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-2.5 h-2.5 rounded-sm",
              "motion-safe:animate-[fall_3s_linear_infinite]",
              "motion-reduce:hidden"
            )}
            style={{
              left: `${5 + i * 8}%`,
              animationDelay: `${i * 0.25}s`,
              backgroundColor: [
                "#22c55e",
                "#3b82f6",
                "#f59e0b",
                "#8b5cf6",
                "#ec4899",
              ][i % 5],
            }}
          />
        ))}
      </div>

      {/* Modal Content */}
      <Card
        className={cn(
          "relative w-full max-w-md mx-auto",
          "motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:slide-in-from-bottom-4",
          "motion-safe:duration-300 motion-safe:ease-out",
          "motion-reduce:animate-none",
          className
        )}
      >
        <CardHeader className="text-center pb-2">
          {/* Trophy Icon */}
          <div className="mx-auto mb-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white w-10 h-10 sm:w-12 sm:h-12"
              aria-hidden="true"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>

          <CardTitle
            id="win-title"
            className="text-3xl sm:text-4xl font-heading font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent"
          >
            Puzzle Solved!
          </CardTitle>
          <CardDescription id="win-description" className="text-base">
            {difficultyLabels[difficulty]} difficulty conquered
          </CardDescription>

          {isNewRecord && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
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
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
              New Personal Best!
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Time Display */}
          <div className="text-center">
            <div className="font-heading text-4xl sm:text-5xl font-bold text-foreground tabular-nums">
              {time}
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">
              Your Time
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-muted rounded-xl p-4 space-y-3">
            <h3 className="font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Game Statistics
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="flex items-center gap-2 text-muted-foreground text-sm">
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
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Solve Time
                </span>
                <span className="font-heading font-semibold tabular-nums">{time}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="flex items-center gap-2 text-muted-foreground text-sm">
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
                    aria-hidden="true"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                  </svg>
                  Hints Used
                </span>
                <span className="font-heading font-semibold tabular-nums">
                  {hintsUsed}/{totalHints}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="flex items-center gap-2 text-muted-foreground text-sm">
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
                    aria-hidden="true"
                  >
                    <path d="M12 2v20" />
                    <path d="m15 19-3 3-3-3" />
                    <path d="m19 9 3 3-3 3" />
                    <path d="M2 12h20" />
                    <path d="m5 9-3 3 3 3" />
                  </svg>
                  Difficulty
                </span>
                <span className="font-heading font-semibold">
                  {difficultyLabels[difficulty]}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="flex items-center gap-2 text-muted-foreground text-sm">
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
                    aria-hidden="true"
                  >
                    <path d="M3 7v6h6" />
                    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                  </svg>
                  Moves
                </span>
                <span className="font-heading font-semibold text-green-500 tabular-nums">
                  {moves}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onPlayAgain}
              className="flex-1 h-12 font-heading font-semibold cursor-pointer"
              size="lg"
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
                className="mr-2"
                aria-hidden="true"
              >
                <line x1="6" x2="10" y1="12" y2="12" />
                <line x1="8" x2="8" y1="10" y2="14" />
                <line x1="15" x2="15.01" y1="13" y2="13" />
                <line x1="18" x2="18.01" y1="11" y2="11" />
                <rect width="20" height="12" x="2" y="6" rx="2" />
              </svg>
              Play Again
            </Button>
            <Button
              onClick={onMainMenu}
              variant="outline"
              className="flex-1 h-12 font-heading font-semibold cursor-pointer"
              size="lg"
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
                className="mr-2"
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Main Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
