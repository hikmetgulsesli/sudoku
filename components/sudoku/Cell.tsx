'use client';

import { cn } from '@/lib/utils';
import { Cell as CellType } from '@/types/sudoku';

interface CellProps {
  cell: CellType;
  row: number;
  col: number;
  isSelected: boolean;
  onClick: () => void;
  onNumberInput: (num: number) => void;
  isPaused: boolean;
}

export function Cell({ cell, row, col, isSelected, onClick, onNumberInput, isPaused }: CellProps) {
  const handleClick = () => {
    if (!isPaused) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isPaused) return;
    
    const key = e.key;
    if (key >= '1' && key <= '9') {
      e.preventDefault();
      onNumberInput(parseInt(key, 10));
    } else if (key === 'Backspace' || key === 'Delete') {
      e.preventDefault();
      onNumberInput(0);
    }
  };

  // Determine border classes
  const isThickRight = col === 2 || col === 5;
  const isThickBottom = row === 2 || row === 5;

  return (
    <button
      data-cell-row={row}
      data-cell-col={col}
      data-cell-value={cell.value}
      data-cell-fixed={cell.isFixed}
      data-cell-selected={isSelected}
      className={cn(
        'w-full aspect-square flex items-center justify-center text-xl font-semibold transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
        'border-r border-b border-slate-600',
        isThickRight && 'border-r-2 border-r-slate-800',
        isThickBottom && 'border-b-2 border-b-slate-800',
        col === 8 && 'border-r-0',
        row === 8 && 'border-b-0',
        isSelected && !isPaused && 'bg-blue-100 dark:bg-blue-900/30',
        !isSelected && !isPaused && 'hover:bg-slate-100 dark:hover:bg-slate-800/50',
        isPaused && 'cursor-default',
        !isPaused && 'cursor-pointer',
        cell.isFixed && 'text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/30',
        !cell.isFixed && cell.value && 'text-blue-600 dark:text-blue-400',
        !cell.isValid && 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={cell.isFixed || isPaused}
      tabIndex={isPaused ? -1 : 0}
    >
      {cell.value || ''}
    </button>
  );
}
