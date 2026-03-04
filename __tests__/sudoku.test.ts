/**
 * Tests for Sudoku puzzle generator
 */

import {
  isValidMove,
  hasUniqueSolution,
  countSolutions,
  generateSolvedBoard,
  createPuzzle,
  generateFullPuzzle,
  countClues,
  isValidPuzzle,
  Difficulty,
} from '@/lib/sudoku';

describe('Sudoku Generator', () => {
  describe('isValidMove', () => {
    it('should return true for valid moves', () => {
      const board: number[][] = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0] = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // Last cell empty

      expect(isValidMove(board, 0, 8, 9)).toBe(true);
    });

    it('should return false for duplicate in row', () => {
      const board: number[][] = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0] = [1, 2, 3, 4, 5, 6, 7, 8, 0];

      expect(isValidMove(board, 0, 8, 1)).toBe(false);
    });

    it('should return false for duplicate in column', () => {
      const board: number[][] = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0][0] = 5;

      expect(isValidMove(board, 1, 0, 5)).toBe(false);
    });

    it('should return false for duplicate in 3x3 box', () => {
      const board: number[][] = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0][0] = 5;

      expect(isValidMove(board, 1, 1, 5)).toBe(false);
    });

    it('should return true for same position with same number', () => {
      const board: number[][] = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0][0] = 5;

      // When checking the same cell, it should be valid
      expect(isValidMove(board, 0, 0, 5)).toBe(true);
    });
  });

  describe('generateSolvedBoard', () => {
    it('should create a valid completed Sudoku grid (AC 1)', () => {
      const board = generateSolvedBoard();

      // Check dimensions
      expect(board).toHaveLength(9);
      board.forEach((row) => {
        expect(row).toHaveLength(9);
      });

      // Check all cells are filled (no zeros)
      board.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toBeGreaterThanOrEqual(1);
          expect(cell).toBeLessThanOrEqual(9);
        });
      });

      // Check validity - no duplicates in rows, columns, or boxes
      expect(isValidBoard(board)).toBe(true);
    });

    it('should create different boards on multiple calls', () => {
      const board1 = generateSolvedBoard();
      const board2 = generateSolvedBoard();

      // Boards should be different (very unlikely to be identical)
      let different = false;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board1[i][j] !== board2[i][j]) {
            different = true;
            break;
          }
        }
      }
      expect(different).toBe(true);
    });
  });

  describe('countSolutions', () => {
    it('should return 1 for a valid puzzle with unique solution', () => {
      const board = generateSolvedBoard();
      // Remove a few cells to make it a puzzle
      const puzzle = board.map((row) => [...row]);
      puzzle[0][0] = 0;
      puzzle[0][1] = 0;
      puzzle[1][0] = 0;

      const solutions = countSolutions(puzzle);
      expect(solutions).toBe(1);
    });

    it('should return 2 for a puzzle with multiple solutions', () => {
      // Create a puzzle that's known to have multiple solutions
      const puzzle: number[][] = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      // Minimal puzzle that can have multiple solutions
      puzzle[0][0] = 1;
      puzzle[1][1] = 2;

      const solutions = countSolutions(puzzle, 2);
      expect(solutions).toBeGreaterThan(1);
    });
  });

  describe('hasUniqueSolution', () => {
    it('should return true for a valid puzzle (AC 2, 7)', () => {
      const solution = generateSolvedBoard();
      const puzzle = createPuzzle(solution, 'easy');

      expect(hasUniqueSolution(puzzle)).toBe(true);
    });
  });

  describe('createPuzzle - Difficulty Levels', () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

    difficulties.forEach((difficulty) => {
      describe(`${difficulty} difficulty`, () => {
        it(`should produce correct clue count for ${difficulty} (AC 3, 4, 5)`, () => {
          const solution = generateSolvedBoard();
          const puzzle = createPuzzle(solution, difficulty);
          const clueCount = countClues(puzzle);

          switch (difficulty) {
            case 'easy':
              expect(clueCount).toBeGreaterThanOrEqual(35);
              expect(clueCount).toBeLessThanOrEqual(40);
              break;
            case 'medium':
              expect(clueCount).toBeGreaterThanOrEqual(30);
              expect(clueCount).toBeLessThanOrEqual(34);
              break;
            case 'hard':
              expect(clueCount).toBeGreaterThanOrEqual(25);
              expect(clueCount).toBeLessThanOrEqual(29);
              break;
          }
        });

        it(`should have unique solution for ${difficulty} (AC 2, 7)`, () => {
          const solution = generateSolvedBoard();
          const puzzle = createPuzzle(solution, difficulty);

          expect(hasUniqueSolution(puzzle)).toBe(true);
        });

        it(`should be solvable for ${difficulty} (AC 7)`, () => {
          const solution = generateSolvedBoard();
          const puzzle = createPuzzle(solution, difficulty);

          expect(isValidPuzzle(puzzle, solution)).toBe(true);
        });
      });
    });
  });

  describe('generateFullPuzzle', () => {
    it('should return a complete puzzle object', () => {
      const puzzle = generateFullPuzzle('medium');

      expect(puzzle).toHaveProperty('initial');
      expect(puzzle).toHaveProperty('solution');
      expect(puzzle).toHaveProperty('difficulty');

      expect(puzzle.difficulty).toBe('medium');
      expect(puzzle.initial).toHaveLength(9);
      expect(puzzle.solution).toHaveLength(9);
    });

    it('should generate valid puzzles for all difficulties', () => {
      const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

      difficulties.forEach((difficulty) => {
        const puzzle = generateFullPuzzle(difficulty);
        expect(isValidPuzzle(puzzle.initial, puzzle.solution)).toBe(true);
      });
    });
  });

  describe('countClues', () => {
    it('should return 81 for a solved board', () => {
      const board = generateSolvedBoard();
      expect(countClues(board)).toBe(81);
    });

    it('should return 0 for an empty board', () => {
      const board: number[][] = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      expect(countClues(board)).toBe(0);
    });
  });
});

// Helper function to check if a board is valid
function isValidBoard(board: number[][]): boolean {
  // Check rows
  for (let row = 0; row < 9; row++) {
    const seen = new Set<number>();
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num !== 0) {
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const seen = new Set<number>();
    for (let row = 0; row < 9; row++) {
      const num = board[row][col];
      if (num !== 0) {
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }
  }

  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set<number>();
      for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
        for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
          const num = board[row][col];
          if (num !== 0) {
            if (seen.has(num)) return false;
            seen.add(num);
          }
        }
      }
    }
  }

  return true;
}
