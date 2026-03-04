"use client";

import { cn } from "@/lib/utils";
import { Cell } from "@/lib/sudoku";

interface CellProps {
  cell: Cell;
  row: number;
  col: number;
  isSelected: boolean;
  onClick: () => void;
}

export function SudokuCell({ cell, row, col, isSelected, onClick }: CellProps) {
  // Determine borders based on position
  const isThickRight = col === 2 || col === 5;
  const isThickBottom = row === 2 || row === 5;

  return (
    <button
      data-testid={`cell-${row}-${col}`}
      data-row={row}
      data-col={col}
      data-fixed={cell.isFixed}
      data-value={cell.value}
      data-valid={cell.isValid}
      onClick={onClick}
      disabled={cell.isFixed}
      className={cn(
        // Base styles
        "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
        "flex items-center justify-center",
        "text-lg sm:text-xl md:text-2xl font-semibold",
        "transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        // Borders
        "border border-slate-600",
        isThickRight && "border-r-2 border-r-slate-800",
        isThickBottom && "border-b-2 border-b-slate-800",
        // Selection state
        isSelected && "bg-blue-100 dark:bg-blue-900",
        // Fixed vs user input styling
        cell.isFixed
          ? "text-slate-900 dark:text-slate-100 cursor-default bg-slate-100 dark:bg-slate-800"
          : "text-blue-600 dark:text-blue-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800",
        // Invalid state
        !cell.isValid && "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
        // Highlight same number
        !isSelected && !cell.isFixed && !cell.isValid && "hover:bg-slate-200 dark:hover:bg-slate-700"
      )}
      style={{
        fontFamily: "var(--font-heading)",
      }}
    >
      {cell.value || ""}
    </button>
  );
}
