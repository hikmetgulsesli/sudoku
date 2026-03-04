import { describe, it, expect } from 'vitest';
import { 
  generateSolution, 
  createPuzzle, 
  createBoard, 
  isValidMoveOnBoard, 
  checkWinCondition,
  isBoardComplete
} from '@/lib/sudoku';

describe('Sudoku Logic', () => {
  describe('generateSolution', () => {
    it('should generate a valid 9x9 solution', () => {
      const solution = generateSolution();
      
      expect(solution).toHaveLength(9);
      solution.forEach(row => {
        expect(row).toHaveLength(9);
        row.forEach(cell => {
          expect(cell).toBeGreaterThanOrEqual(1);
          expect(cell).toBeLessThanOrEqual(9);
        });
      });
    });

    it('should generate a valid solution with no conflicts', () => {
      const solution = generateSolution();
      
      // Check rows have unique values
      solution.forEach(row => {
        const unique = new Set(row);
        expect(unique.size).toBe(9);
      });
      
      // Check columns have unique values
      for (let col = 0; col < 9; col++) {
        const column = solution.map(row => row[col]);
        const unique = new Set(column);
        expect(unique.size).toBe(9);
      }
    });
  });

  describe('createPuzzle', () => {
    it('should create a puzzle with empty cells for easy difficulty', () => {
      const solution = generateSolution();
      const puzzle = createPuzzle(solution, 'easy');
      
      let emptyCount = 0;
      puzzle.forEach(row => {
        row.forEach(cell => {
          if (cell === 0) emptyCount++;
        });
      });
      
      // Easy should have between 40-50 empty cells (35-45 clues)
      expect(emptyCount).toBeGreaterThan(35);
      expect(emptyCount).toBeLessThan(50);
    });

    it('should create a puzzle with empty cells for hard difficulty', () => {
      const solution = generateSolution();
      const puzzle = createPuzzle(solution, 'hard');
      
      let emptyCount = 0;
      puzzle.forEach(row => {
        row.forEach(cell => {
          if (cell === 0) emptyCount++;
        });
      });
      
      // Hard should have between 50-60 empty cells (21-31 clues)
      expect(emptyCount).toBeGreaterThan(50);
      expect(emptyCount).toBeLessThan(62);
    });
  });

  describe('createBoard', () => {
    it('should convert puzzle to Cell objects', () => {
      const puzzle = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ];
      
      const board = createBoard(puzzle);
      
      expect(board[0][0].value).toBe(5);
      expect(board[0][0].isFixed).toBe(true);
      expect(board[0][2].value).toBeNull();
      expect(board[0][2].isFixed).toBe(false);
    });
  });

  describe('isValidMove', () => {
    it('should return true for valid moves', () => {
      const board = createBoard([
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ]);
      
      expect(isValidMoveOnBoard(board, 0, 2, 1)).toBe(true);
    });

    it('should return false for invalid row moves', () => {
      const board = createBoard([
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ]);
      
      // 5 is already in row 0
      expect(isValidMoveOnBoard(board, 0, 2, 5)).toBe(false);
    });

    it('should return false for invalid column moves', () => {
      const board = createBoard([
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ]);
      
      // 6 is already in column 0
      expect(isValidMoveOnBoard(board, 2, 0, 6)).toBe(false);
    });
  });

  describe('checkWinCondition', () => {
    it('should return true when board matches solution', () => {
      const solution = generateSolution();
      const board = createBoard(solution);
      
      expect(checkWinCondition(board, solution)).toBe(true);
    });

    it('should return false when board does not match solution', () => {
      const solution = generateSolution();
      const puzzle = createPuzzle(solution, 'easy');
      const board = createBoard(puzzle);
      
      expect(checkWinCondition(board, solution)).toBe(false);
    });
  });

  describe('isBoardComplete', () => {
    it('should return true when all cells are filled', () => {
      const solution = generateSolution();
      const board = createBoard(solution);
      
      expect(isBoardComplete(board)).toBe(true);
    });

    it('should return false when some cells are empty', () => {
      const solution = generateSolution();
      const puzzle = createPuzzle(solution, 'easy');
      const board = createBoard(puzzle);
      
      expect(isBoardComplete(board)).toBe(false);
    });
  });
});
