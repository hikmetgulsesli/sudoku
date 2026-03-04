// Sudoku game types
// Difficulty type is defined in lib/sudoku.ts - import from there for consistency

export interface CellData {
  value: number | null;
  isFixed: boolean;
  isConflict?: boolean;
  isHighlighted?: boolean;
}

export interface GameState {
  grid: CellData[];
  difficulty: import('../lib/sudoku').Difficulty;
  timer: number;
  isComplete: boolean;
  moves: number;
}

export interface SudokuPuzzle {
  puzzle: number[][];
  solution: number[][];
  difficulty: import('../lib/sudoku').Difficulty;
}
