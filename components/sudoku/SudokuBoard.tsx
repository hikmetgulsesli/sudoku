import * as React from "react";
import { cn } from "@/lib/utils";
import { Cell } from "./Cell";
import type { Board } from "@/types/sudoku";

interface SudokuBoardProps {
  board: Board;
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  className?: string;
}

export function SudokuBoard({
  board,
  selectedCell,
  onCellClick,
  className,
}: SudokuBoardProps) {
  const isHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false;
    const { row: selRow, col: selCol } = selectedCell;
    const selValue = board[selRow][selCol].value;

    // Highlight same row, column, or 3x3 box
    const sameRow = row === selRow;
    const sameCol = col === selCol;
    const sameBox =
      Math.floor(row / 3) === Math.floor(selRow / 3) &&
      Math.floor(col / 3) === Math.floor(selCol / 3);

    // Highlight cells with same number
    const sameNumber =
      selValue !== null && board[row][col].value === selValue;

    return (sameRow || sameCol || sameBox || sameNumber) && !(row === selRow && col === selCol);
  };

  return (
    <div
      className={cn(
        "bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg border-2 border-foreground/20",
        className
      )}
      role="grid"
      aria-label="Sudoku puzzle grid"
    >
      <div className="grid grid-cols-9 gap-0 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[468px] mx-auto aspect-square">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell.value}
              isFixed={cell.isFixed}
              isSelected={
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex
              }
              isHighlighted={isHighlighted(rowIndex, colIndex)}
              isValid={cell.isValid}
              row={rowIndex}
              col={colIndex}
              onClick={onCellClick}
              notes={cell.notes}
            />
          ))
        )}
      </div>
    </div>
  );
}
