/**
 * Sudoku puzzle generation and validation utilities
 */
import type { Difficulty } from '../types';

export type { Difficulty } from '../types';

export interface Puzzle {
  initial: number[][];
  solution: number[][];
  difficulty: Difficulty;
}

// Difficulty levels with clue counts
const DIFFICULTY_CLUES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 35, max: 40 },
  medium: { min: 30, max: 34 },
  hard: { min: 25, max: 29 },
};

/**
 * Check if placing a number at a position is valid according to Sudoku rules (number[][] version)
 */
export function isValidMove(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) {
      return false;
    }
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Count the number of solutions for a given board using backtracking
 * Stops early if solutions exceed the limit
 */
export function countSolutions(
  board: number[][],
  limit: number = 2
): number {
  let count = 0;

  function solve(b: number[][]): boolean {
    if (count >= limit) {
      return true; // Stop early
    }

    // Find empty cell
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] === 0) {
          // Try numbers 1-9
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(b, row, col, num)) {
              b[row][col] = num;

              if (solve(b)) {
                return true;
              }

              b[row][col] = 0;
            }
          }
          return false; // No valid number found
        }
      }
    }

    // All cells filled - found a solution
    count++;
    return false;
  }

  // Work on a copy to avoid modifying the original
  const boardCopy = board.map(row => [...row]);
  solve(boardCopy);
  return count;
}

/**
 * Check if a puzzle has a unique solution
 */
export function hasUniqueSolution(board: number[][]): boolean {
  return countSolutions(board, 2) === 1;
}

/**
 * Validate the entire board and return positions of conflicts
 */
export function validateBoard(board: number[][]): { row: number; col: number }[] {
  const conflicts: { row: number; col: number }[] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num !== 0 && !isValidMove(board, row, col, num)) {
        conflicts.push({ row, col });
      }
    }
  }

  return conflicts;
}

/**
 * Check if the puzzle is completely filled and valid (win condition)
 */
export function checkComplete(board: number[][]): boolean {
  // Check all cells are filled
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return false;
      }
    }
  }

  // Check no conflicts
  return validateBoard(board).length === 0;
}

/**
 * Generate a fully solved Sudoku board using backtracking
 */
export function generateSolvedBoard(): number[][] {
  const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));

  // Fill diagonal 3x3 boxes first (they are independent)
  for (let box = 0; box < 3; box++) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // Shuffle
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    let idx = 0;
    for (let row = box * 3; row < box * 3 + 3; row++) {
      for (let col = box * 3; col < box * 3 + 3; col++) {
        board[row][col] = nums[idx++];
      }
    }
  }

  // Solve the rest
  solveBoard(board);
  return board;
}

/**
 * Solve a Sudoku board using backtracking
 */
function solveBoard(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;

            if (solveBoard(board)) {
              return true;
            }

            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Create a puzzle by removing numbers from a solved board
 * Ensures the puzzle has a unique solution
 */
export function createPuzzle(
  solvedBoard: number[][],
  difficulty: Difficulty
): { puzzle: number[][]; solution: number[][] } {
  const solution = solvedBoard.map(row => [...row]);
  const puzzle = solvedBoard.map(row => [...row]);

  const { min, max } = DIFFICULTY_CLUES[difficulty];
  const targetClues = Math.floor(Math.random() * (max - min + 1)) + min;
  const cellsToRemove = 81 - targetClues;

  // Create list of all positions and shuffle
  const positions: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }

  // Fisher-Yates shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= cellsToRemove) break;

    const originalValue = puzzle[row][col];
    puzzle[row][col] = 0;

    // Check if still has unique solution
    if (hasUniqueSolution(puzzle)) {
      removed++;
    } else {
      // Restore the value
      puzzle[row][col] = originalValue;
    }
  }

  return { puzzle, solution };
}

/**
 * Generate a complete Sudoku puzzle with the specified difficulty
 */
export function generatePuzzle(difficulty: Difficulty): Puzzle {
  const solvedBoard = generateSolvedBoard();
  const { puzzle, solution } = createPuzzle(solvedBoard, difficulty);

  return {
    initial: puzzle,
    solution,
    difficulty,
  };
}

/**
 * Generate a puzzle with a unique solution using constraint propagation
 */
export function generateFullPuzzle(difficulty: Difficulty): Puzzle {
  // Generate a solved board
  const solution = generateSolvedBoard();

  // Create puzzle by removing cells
  const { puzzle } = createPuzzle(solution, difficulty);

  return {
    initial: puzzle,
    solution,
    difficulty,
  };
}

// Legacy exports for backward compatibility with existing code
export interface Cell {
  value: number | null;
  isFixed: boolean;
  isValid: boolean;
  notes: number[];
}

export type Board = Cell[][];

export interface Move {
  row: number;
  col: number;
  previousValue: number | null;
  newValue: number | null;
}

/**
 * Find all cells with conflicts (invalid placements)
 */
export function findConflicts(board: Board): { row: number; col: number }[] {
  const conflicts: { row: number; col: number }[] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = board[row][col];
      if (cell.value !== null && !cell.isValid) {
        conflicts.push({ row, col });
      }
    }
  }

  return conflicts;
}

/**
 * Check if the board is completely filled with valid values
 */
export function isBoardComplete(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = board[row][col];
      if (cell.value === null || !cell.isValid) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Create an initial board state from a puzzle
 */
export function createBoardFromPuzzle(puzzle: number[][]): Board {
  return puzzle.map(row =>
    row.map(value => ({
      value: value === 0 ? null : value,
      isFixed: value !== 0,
      isValid: true,
      notes: [],
    }))
  );
}

/**
 * Convert board to a simple number grid for validation
 */
export function boardToGrid(board: Board): number[][] {
  return board.map(row =>
    row.map(cell => cell.value ?? 0)
  );
}

/**
 * Generate a complete puzzle (alias for generateFullPuzzle)
 */
export function generateFullPuzzleAlias(difficulty: Difficulty): Puzzle {
  return generateFullPuzzle(difficulty);
}

// ============================================================================
// Additional helper functions
// ============================================================================

/**
 * Generate a complete valid Sudoku solution
 * Alias for generateSolvedBoard for consistency
 */
export function generateSolution(): number[][] {
  return generateSolvedBoard();
}

/**
 * Create a puzzle by removing numbers from a solution
 * New version that takes difficulty directly
 */
export function createPuzzleFromSolution(solution: number[][], difficulty: Difficulty): number[][] {
  return createPuzzle(solution, difficulty);
}

/**
 * Check if the puzzle is complete and correct
 * Compares board values against solution
 */
export function checkWinCondition(board: Cell[][], solution: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Convert a puzzle (number[][]) to a Board with fixed cells marked
 */
export function puzzleToBoard(puzzle: number[][]): Cell[][] {
  return numbersToBoard(puzzle);
}

/**
 * Convert number grid to Board type
 */
export function numbersToBoard(puzzle: number[][]): Cell[][] {
  return puzzle.map(row =>
    row.map(value => ({
      value: value === 0 ? null : value,
      isFixed: value !== 0,
      isValid: true,
      notes: [],
    }))
  );
}

/**
 * Alias for numbersToBoard
 */
export function createBoard(puzzle: number[][]): Cell[][] {
  return numbersToBoard(puzzle);
}

/**
 * Check if placing a number at a position is valid according to Sudoku rules (Board type version)
 */
export function isValidMoveOnBoard(
  board: Cell[][],
  row: number,
  col: number,
  num: number | null
): boolean {
  if (num === null) return true;
  return isValidCellValue(board, row, col, num);
}
