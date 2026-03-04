// Sudoku game types

export interface CellData {
  value: number | null;
  isFixed: boolean;
  isConflict?: boolean;
  isHighlighted?: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  grid: CellData[];
  difficulty: Difficulty;
  timer: number;
  isComplete: boolean;
  moves: number;
}

export interface SudokuPuzzle {
  puzzle: number[][];
  solution: number[][];
  difficulty: Difficulty;
}
