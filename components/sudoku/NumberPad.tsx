import * as React from "react";
import { cn } from "@/lib/utils";

interface NumberPadProps {
  onNumberSelect: (number: number) => void;
  disabledNumbers?: number[];
  selectedNumber?: number | null;
  className?: string;
}

export function NumberPad({
  onNumberSelect,
  disabledNumbers = [],
  selectedNumber,
  className,
}: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div
      className={cn(
        "bg-card rounded-xl p-4 shadow-sm border border-border",
        className
      )}
      role="group"
      aria-label="Number pad"
    >
      <h3 className="font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Number Pad
      </h3>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {numbers.map((num) => {
          const isDisabled = disabledNumbers.includes(num);
          const isSelected = selectedNumber === num;

          return (
            <button
              key={num}
              onClick={() => !isDisabled && onNumberSelect(num)}
              disabled={isDisabled}
              className={cn(
                "w-full aspect-square min-h-[44px] sm:min-h-[52px] md:min-h-[60px]",
                "rounded-lg sm:rounded-xl",
                "font-heading text-lg sm:text-xl md:text-2xl font-semibold",
                "transition-all duration-150 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "active:scale-95",
                "motion-safe:hover:scale-105",
                {
                  "bg-primary text-primary-foreground shadow-md": isSelected,
                  "bg-muted text-foreground hover:bg-muted/80": !isSelected && !isDisabled,
                  "opacity-40 cursor-not-allowed": isDisabled,
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground hover:shadow-md":
                    !isDisabled && !isSelected,
                }
              )}
              aria-label={`Select number ${num}`}
              aria-pressed={isSelected}
              aria-disabled={isDisabled}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
