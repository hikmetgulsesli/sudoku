import * as React from "react";
import { cn } from "@/lib/utils";

interface CellProps {
  value: number | null;
  isFixed: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isValid: boolean;
  row: number;
  col: number;
  onClick: (row: number, col: number) => void;
  notes?: number[];
  className?: string;
}

export function Cell({
  value,
  isFixed,
  isSelected,
  isHighlighted,
  isValid,
  row,
  col,
  onClick,
  notes = [],
  className,
}: CellProps) {
  const isThickRightBorder = (col + 1) % 3 === 0 && col !== 8;
  const isThickBottomBorder = (row + 1) % 3 === 0 && row !== 8;

  return (
    <button
      onClick={() => onClick(row, col)}
      className={cn(
        "relative flex items-center justify-center",
        "w-full aspect-square",
        "font-heading font-semibold",
        "text-base sm:text-lg md:text-xl lg:text-2xl",
        "border border-border",
        "transition-all duration-150 ease-out",
        "focus-visible:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        "motion-reduce:transition-none",
        {
          "cursor-pointer hover:bg-muted/50": !isFixed,
          "cursor-default": isFixed,
          "bg-card": !isSelected && !isHighlighted,
          "bg-primary/10": isHighlighted && !isSelected,
          "bg-primary/20": isSelected,
          "ring-2 ring-primary ring-inset z-10": isSelected,
          "text-foreground": isFixed,
          "text-primary": !isFixed && value !== null,
          "text-destructive": !isValid && value !== null,
          "border-r-2 border-r-foreground/20": isThickRightBorder,
          "border-b-2 border-b-foreground/20": isThickBottomBorder,
        },
        className
      )}
      data-row={row}
      data-col={col}
      data-fixed={isFixed}
      data-selected={isSelected}
      aria-label={
        value !== null
          ? `Cell ${row + 1},${col + 1}: ${value}`
          : `Empty cell ${row + 1},${col + 1}`
      }
      data-selected-state={isSelected}
    >
      {value !== null ? (
        <span
          className={cn(
            "motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-150",
            "motion-reduce:animate-none"
          )}
        >
          {value}
        </span>
      ) : notes.length > 0 ? (
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-0.5 sm:p-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span
              key={n}
              className={cn(
                "flex items-center justify-center",
                "text-[8px] sm:text-[10px] md:text-xs",
                "font-normal text-muted-foreground",
                notes.includes(n) ? "opacity-100" : "opacity-0"
              )}
            >
              {notes.includes(n) ? n : ""}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}
