"use client";

import React from "react";
import { Cell } from "./Cell";

export interface CellData {
  /** The value in the cell (1-9 or null) */
  value: number | null;
  /** Whether this is a fixed (original puzzle) cell */
  isFixed?: boolean;
  /** Whether this cell has a conflict */
  isConflict?: boolean;
}

export interface SudokuBoardProps {
  /** 9x9 grid data - array of 81 cells (row-major order) */
  grid: CellData[];
  /** Index of the currently selected cell (0-80, null if none) */
  selectedIndex?: number | null;
  /** Callback when a cell is clicked */
  onCellClick?: (index: number) => void;
  /** Optional CSS class for the container */
  className?: string;
  /** Optional test ID */
  "data-testid"?: string;
}

/**
 * Get the row index (0-8) for a given cell index (0-80)
 */
function getRow(index: number): number {
  return Math.floor(index / 9);
}

/**
 * Get the column index (0-8) for a given cell index (0-80)
 */
function getCol(index: number): number {
  return index % 9;
}

/**
 * Get the 3x3 box index (0-8) for a given cell index (0-80)
 */
function getBox(index: number): number {
  const row = getRow(index);
  const col = getCol(index);
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

/**
 * Check if two cells are in the same row
 */
function isSameRow(index1: number, index2: number): boolean {
  return getRow(index1) === getRow(index2);
}

/**
 * Check if two cells are in the same column
 */
function isSameCol(index1: number, index2: number): boolean {
  return getCol(index1) === getCol(index2);
}

/**
 * Check if two cells are in the same 3x3 box
 */
function isSameBox(index1: number, index2: number): boolean {
  return getBox(index1) === getBox(index2);
}

/**
 * SudokuBoard - A 9x9 Sudoku grid component with responsive layout
 *
 * Features:
 * - 9x9 grid with 81 cells
 * - Visual distinction for 3x3 subgrids with thicker borders
 * - Cell states: empty, filled, selected, highlighted, conflict
 * - Responsive sizing (40px mobile, 50px desktop)
 * - Centered layout with max-width constraint
 */
export function SudokuBoard({
  grid,
  selectedIndex = null,
  onCellClick,
  className = "",
  "data-testid": testId,
}: SudokuBoardProps) {
  // Validate grid has 81 cells
  if (grid.length !== 81) {
    console.warn("SudokuBoard: grid must have exactly 81 cells");
  }

  /**
   * Check if a cell should be highlighted (same row, column, or box as selected)
   */
  const isHighlighted = (index: number): boolean => {
    if (selectedIndex === null) return false;
    if (index === selectedIndex) return false; // Selected cell has its own style
    return isSameRow(index, selectedIndex) || isSameCol(index, selectedIndex) || isSameBox(index, selectedIndex);
  };

  return (
    <div
      className={`
        inline-block
        bg-[var(--color-surface)]
        p-4
        sm:p-5
        md:p-6
        rounded-xl
        shadow-lg
        ${className}
      `.trim()}
      data-testid={testId}
    >
      <div
        className="
          grid
          grid-cols-9
          gap-0
          border-2
          border-[var(--color-grid)]
          bg-[var(--color-grid)]
        "
        style={{
          width: "fit-content",
        }}
      >
        {grid.map((cell, index) => {
          const row = getRow(index);
          const col = getCol(index);
          const highlighted = isHighlighted(index);
          const selected = index === selectedIndex;

          return (
            <div
              key={index}
              className="
                w-[40px]
                h-[40px]
                sm:w-[44px]
                sm:h-[44px]
                md:w-[50px]
                md:h-[50px]
                bg-[var(--color-surface)]
              "
              style={{
                gridColumn: col + 1,
                gridRow: row + 1,
              }}
            >
              <Cell
                value={cell.value}
                isFixed={cell.isFixed}
                isSelected={selected}
                isHighlighted={highlighted}
                isConflict={cell.isConflict}
                onClick={() => onCellClick?.(index)}
                row={row}
                col={col}
                data-testid={`cell-${index}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SudokuBoard;
