/**
 * Represents a Sudoku grid cell
 */
export interface Cell {
  value: number | null;
  isFixed: boolean;
  isValid: boolean;
  notes: number[];
}

/**
 * Represents the entire Sudoku board (9x9 grid)
 */
export type Board = Cell[][];

/**
 * Difficulty levels for Sudoku puzzles
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Game state interface
 */
export interface GameState {
  board: Board;
  difficulty: Difficulty;
  timer: number;
  isComplete: boolean;
  moveHistory: Move[];
}

/**
 * Represents a single move in the game history
 */
export interface Move {
  row: number;
  col: number;
  previousValue: number | null;
  newValue: number | null;
  timestamp: number;
}
