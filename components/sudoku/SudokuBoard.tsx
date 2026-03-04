"use client";

import { Board } from "@/lib/sudoku";
import { SudokuCell } from "./Cell";

interface SudokuBoardProps {
  board: Board;
  selectedRow: number | null;
  selectedCol: number | null;
  onCellClick: (row: number, col: number) => void;
}

export function SudokuBoard({
  board,
  selectedRow,
  selectedCol,
  onCellClick,
}: SudokuBoardProps) {
  return (
    <div
      data-testid="sudoku-board"
      className="inline-grid grid-cols-9 gap-0 border-2 border-slate-800 dark:border-slate-600 rounded-lg overflow-hidden bg-slate-800"
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <SudokuCell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            row={rowIndex}
            col={colIndex}
            isSelected={selectedRow === rowIndex && selectedCol === colIndex}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}
