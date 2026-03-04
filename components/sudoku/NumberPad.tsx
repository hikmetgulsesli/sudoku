"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NumberPadProps {
  onNumberClick: (num: number) => void;
  completedNumbers: number[];
  disabled?: boolean;
}

export function NumberPad({ onNumberClick, completedNumbers, disabled }: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="grid grid-cols-3 gap-2" data-testid="number-pad">
      {numbers.map((num) => {
        const isCompleted = completedNumbers.includes(num);
        return (
          <Button
            key={num}
            data-testid={`number-btn-${num}`}
            data-number={num}
            data-completed={isCompleted}
            variant="outline"
            onClick={() => onNumberClick(num)}
            disabled={disabled || isCompleted}
            className={cn(
              "h-14 w-14 text-xl font-semibold cursor-pointer",
              "transition-all duration-150",
              "hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300",
              "focus-visible:ring-2 focus-visible:ring-blue-500",
              isCompleted && "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
            )}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {num}
          </Button>
        );
      })}
    </div>
  );
}
