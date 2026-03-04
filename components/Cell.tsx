"use client";

import React from "react";

export interface CellProps {
  /** The value to display (1-9 or null for empty) */
  value: number | null;
  /** Whether this cell is part of the original puzzle (fixed) */
  isFixed?: boolean;
  /** Whether this cell is currently selected */
  isSelected?: boolean;
  /** Whether this cell should be highlighted (same row/column/box as selected) */
  isHighlighted?: boolean;
  /** Whether this cell has a conflict (invalid number) */
  isConflict?: boolean;
  /** Callback when cell is clicked */
  onClick?: () => void;
  /** Row index (0-8) */
  row: number;
  /** Column index (0-8) */
  col: number;
  /** Test ID for testing */
  "data-testid"?: string;
}

export function Cell({
  value,
  isFixed = false,
  isSelected = false,
  isHighlighted = false,
  isConflict = false,
  onClick,
  row,
  col,
  "data-testid": testId,
}: CellProps) {
  // Determine if this cell is at a thick border position
  // Thick borders after every 3rd column (indexes 2, 5) and row (indexes 2, 5)
  const isThickRightBorder = col === 2 || col === 5;
  const isThickBottomBorder = row === 2 || row === 5;

  // Base classes
  const baseClasses = [
    "flex",
    "items-center",
    "justify-center",
    "font-semibold",
    "cursor-pointer",
    "transition-colors",
    "duration-150",
    "select-none",
    "w-full",
    "h-full",
  ];

  // Border classes
  const borderClasses = [
    "border",
    "border-[var(--color-border)]",
    isThickRightBorder ? "border-r-[var(--sudoku-border-thick)] border-r-[var(--color-grid)]" : "",
    isThickBottomBorder ? "border-b-[var(--sudoku-border-thick)] border-b-[var(--color-grid)]" : "",
  ];

  // State-based classes
  const stateClasses = [
    // Fixed cells (original puzzle numbers)
    isFixed ? "text-[var(--color-cell-fixed)]" : "",
    // User input cells
    !isFixed && value ? "text-[var(--color-cell-user)]" : "",
    // Selected state
    isSelected ? "bg-[var(--color-cell-selected)]" : "",
    // Highlighted state (same row/column/box)
    isHighlighted && !isSelected ? "bg-[var(--color-cell-highlight)]" : "",
    // Conflict/error state
    isConflict ? "bg-[var(--color-error-subtle)] text-[var(--color-error)]" : "",
    // Hover state (only for empty cells that aren't selected)
    !isSelected && !value && !isConflict ? "hover:bg-[var(--color-cell-highlight)]" : "",
  ];

  // Font size classes
  const fontClasses = [
    "text-lg",
    "sm:text-xl",
    "md:text-2xl",
    "font-[family-name:var(--font-heading)]",
  ];

  const className = [...baseClasses, ...borderClasses, ...stateClasses, ...fontClasses]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      onClick={onClick}
      data-testid={testId}
      data-row={row}
      data-col={col}
      data-fixed={isFixed}
      data-selected={isSelected}
      data-highlighted={isHighlighted}
      data-conflict={isConflict}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
      aria-label={`Cell row ${row + 1}, column ${col + 1}${value ? `, value ${value}` : ", empty"}`}
    >
      {value || ""}
    </div>
  );
}
