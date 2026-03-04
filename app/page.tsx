"use client";

import { useState } from "react";
import { SudokuBoard, CellData } from "@/components/sudoku";

// Sample Sudoku puzzle (0 = empty)
const samplePuzzle: number[] = [
  5, 3, 0, 0, 7, 0, 0, 0, 0,
  6, 0, 0, 1, 9, 5, 0, 0, 0,
  0, 9, 8, 0, 0, 0, 0, 6, 0,
  8, 0, 0, 0, 6, 0, 0, 0, 3,
  4, 0, 0, 8, 0, 3, 0, 0, 1,
  7, 0, 0, 0, 2, 0, 0, 0, 6,
  0, 6, 0, 0, 0, 0, 2, 8, 0,
  0, 0, 0, 4, 1, 9, 0, 0, 5,
  0, 0, 0, 0, 8, 0, 0, 7, 9,
];

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Convert sample puzzle to CellData format
  const grid: CellData[] = samplePuzzle.map((value) => ({
    value: value === 0 ? null : value,
    isFixed: value !== 0,
    isConflict: false,
  }));

  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2 font-[family-name:var(--font-heading)]">
          Sudoku
        </h1>
        <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-body)]">
          Click a cell to select it
        </p>
      </div>

      <SudokuBoard
        grid={grid}
        selectedIndex={selectedIndex}
        onCellClick={setSelectedIndex}
        data-testid="sudoku-board"
      />

      <div className="mt-6 sm:mt-8 text-center">
        {selectedIndex !== null && (
          <p className="text-[var(--color-text-secondary)] font-[family-name:var(--font-body)]">
            Selected: Row {Math.floor(selectedIndex / 9) + 1}, Col {(selectedIndex % 9) + 1}
          </p>
        )}
      </div>
    </main>
  );
}
