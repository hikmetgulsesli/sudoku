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
 * Check if placing a number at a position is valid according to Sudoku rules
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

    // All cells filled, found a solution
    count++;
    return count >= limit;
  }

  // Clone board to avoid mutating original
  const boardCopy = board.map((row) => [...row]);
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
 * Solve a Sudoku board using backtracking
 * Returns true if solvable, false otherwise
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
 * Generate a completed valid Sudoku board using backtracking with randomization
 */
export function generateSolvedBoard(): number[][] {
  const board: number[][] = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  // Fill diagonal 3x3 boxes first (they are independent)
  // This speeds up generation significantly
  for (let box = 0; box < 3; box++) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // Shuffle numbers
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
 * Create a puzzle by removing cells from a solved board
 * Ensures the puzzle has a unique solution
 */
export function createPuzzle(
  solvedBoard: number[][],
  difficulty: Difficulty
): number[][] {
  const { min, max } = DIFFICULTY_CLUES[difficulty];
  const targetClues = Math.floor(Math.random() * (max - min + 1)) + min;

  // Clone the solved board
  const puzzle: number[][] = solvedBoard.map((row) => [...row]);

  // Create a list of all positions
  const positions: Array<[number, number]> = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }

  // Shuffle positions for random removal
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  let cellsToRemove = 81 - targetClues;

  for (const [row, col] of positions) {
    if (cellsToRemove <= 0) break;

    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    // Check if puzzle still has unique solution
    if (hasUniqueSolution(puzzle)) {
      cellsToRemove--;
    } else {
      // Restore the cell
      puzzle[row][col] = backup;
    }
  }

  return puzzle;
}

/**
 * Generate a complete Sudoku puzzle with solution and difficulty
 */
export function generateFullPuzzle(difficulty: Difficulty): Puzzle {
  const solution = generateSolvedBoard();
  const initial = createPuzzle(solution, difficulty);

  return {
    initial,
    solution,
    difficulty,
  };
}

/**
 * Count the number of clues (non-zero cells) in a puzzle
 */
export function countClues(board: number[][]): number {
  let count = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== 0) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Check if a puzzle is valid (can be solved and matches solution)
 */
export function isValidPuzzle(
  puzzle: number[][],
  expectedSolution: number[][]
): boolean {
  // Check puzzle has unique solution
  if (!hasUniqueSolution(puzzle)) {
    return false;
  }

  // Verify the solution matches
  const boardCopy = puzzle.map((row) => [...row]);
  solveBoard(boardCopy);

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (boardCopy[row][col] !== expectedSolution[row][col]) {
        return false;
      }
    }
  }

  return true;
}
