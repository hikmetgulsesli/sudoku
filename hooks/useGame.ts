"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Board,
  Difficulty,
  Move,
  SelectedCell,
  generateFullPuzzle,
  numbersToBoard,
  validateBoardCells,
  isBoardComplete,
} from "@/lib/sudoku";

export interface UseGameReturn {
  // Board state
  board: Board;
  initialBoard: Board;
  
  // Selection
  selectedCell: SelectedCell | null;
  selectCell: (row: number, col: number) => void;
  
  // Input
  setCellValue: (value: number | null) => void;
  
  // Validation
  conflicts: SelectedCell[];
  
  // Undo
  canUndo: boolean;
  undo: () => void;
  
  // Game state
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  timer: number;
  moves: number;
  isComplete: boolean;
  
  // Number tracking
  numberCounts: Record<number, number>;
  completedNumbers: number[];
  
  // Actions
  newGame: () => void;
  clearCell: () => void;
}

// Helper to generate initial game state
function generateInitialGame(difficulty: Difficulty) {
  const { initial } = generateFullPuzzle(difficulty);
  const newBoard = numbersToBoard(initial);
  return {
    board: validateBoardCells(newBoard),
    initialBoard: newBoard.map((row) => row.map((cell) => ({ ...cell }))),
  };
}

export function useGame(): UseGameReturn {
  // Generate initial game state
  const initialGame = useMemo(() => generateInitialGame("medium"), []);
  
  // Game state
  const [board, setBoard] = useState<Board>(initialGame.board);
  const [initialBoard, setInitialBoard] = useState<Board>(initialGame.initialBoard);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [difficulty, setDifficultyState] = useState<Difficulty>("medium");
  const [timer, setTimer] = useState(0);
  
  // Derive isComplete from board state using useMemo
  const isComplete = useMemo(() => isBoardComplete(board), [board]);

  // Start new game function
  const newGame = useCallback((diff?: Difficulty) => {
    const gameDifficulty = diff || difficulty;
    const { initial } = generateFullPuzzle(gameDifficulty);
    const newBoard = numbersToBoard(initial);
    
    setInitialBoard(newBoard.map((row) => 
      row.map((cell) => ({ ...cell }))
    ));
    setBoard(validateBoardCells(newBoard));
    setSelectedCell(null);
    setMoveHistory([]);
    setTimer(0);
    if (diff) {
      setDifficultyState(diff);
    }
  }, [difficulty]);

  // Timer effect - only interacts with external system (timer)
  useEffect(() => {
    if (isComplete) return;
    
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete]);



  // Calculate number counts
  const numberCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 9; i++) {
      counts[i] = 0;
    }
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = board[row][col].value;
        if (value !== null) {
          counts[value] = (counts[value] || 0) + 1;
        }
      }
    }
    return counts;
  }, [board]);

  // Calculate completed numbers (all 9 placed correctly)
  const completedNumbers = useMemo(() => {
    const completed: number[] = [];
    for (let num = 1; num <= 9; num++) {
      if (numberCounts[num] === 9) {
        completed.push(num);
      }
    }
    return completed;
  }, [numberCounts]);

  // Calculate conflicts (invalid cells)
  const conflicts = useMemo(() => {
    const conflictCells: SelectedCell[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!board[row][col].isValid && board[row][col].value !== null) {
          conflictCells.push({ row, col });
        }
      }
    }
    return conflictCells;
  }, [board]);

  // Select a cell
  const selectCell = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
  }, []);

  // Set value for selected cell
  const setCellValue = useCallback(
    (value: number | null) => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;
      const cell = board[row][col];

      // Prevent editing fixed cells
      if (cell.isFixed) return;

      // Don't update if value is the same
      if (cell.value === value) return;

      // Save move to history
      const move: Move = {
        row,
        col,
        previousValue: cell.value,
        newValue: value,
        timestamp: Date.now(),
      };

      setMoveHistory((prev) => [...prev, move]);

      // Update board
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r) => r.map((c) => ({ ...c })));
        newBoard[row][col] = {
          ...newBoard[row][col],
          value,
        };
        return validateBoardCells(newBoard);
      });
    },
    [selectedCell, board]
  );

  // Undo last move
  const undo = useCallback(() => {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((r) => r.map((c) => ({ ...c })));
      newBoard[lastMove.row][lastMove.col] = {
        ...newBoard[lastMove.row][lastMove.col],
        value: lastMove.previousValue,
      };
      return validateBoardCells(newBoard);
    });

    setMoveHistory((prev) => prev.slice(0, -1));
    
    // Reselect the cell that was undone
    setSelectedCell({ row: lastMove.row, col: lastMove.col });
  }, [moveHistory]);

  // Clear selected cell
  const clearCell = useCallback(() => {
    setCellValue(null);
  }, [setCellValue]);

  // Check if can undo
  const canUndo = moveHistory.length > 0;

  // Count moves
  const moves = moveHistory.length;

  // Set difficulty wrapper - newGame already handles difficulty state update
  const setDifficulty = useCallback((diff: Difficulty) => {
    newGame(diff);
  }, [newGame]);

  return {
    board,
    initialBoard,
    selectedCell,
    selectCell,
    setCellValue,
    conflicts,
    canUndo,
    undo,
    difficulty,
    setDifficulty,
    timer,
    moves,
    isComplete,
    numberCounts,
    completedNumbers,
    newGame: () => newGame(),
    clearCell,
  };
}
