'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Board, Difficulty } from '@/types/sudoku';
import { Cell } from './Cell';
import { generateSolution, createPuzzle, createBoard, validateBoardCells, checkWinCondition, isBoardComplete } from '@/lib/sudoku';
import { useTimer } from '@/hooks/useTimer';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import { GameControls } from './GameControls';
import { WinModal } from './WinModal';
import { PauseOverlay } from './PauseOverlay';

interface SudokuBoardProps {
  initialDifficulty?: Difficulty;
}

export function SudokuBoard({ initialDifficulty = 'medium' }: SudokuBoardProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [board, setBoard] = useState<Board>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'paused' | 'won'>('idle');
  const [hasStarted, setHasStarted] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { seconds, start, pause, reset: resetTimer, setTime, formattedTime } = useTimer();
  const { saveGame, loadGame, clearGame } = useGamePersistence();
  const initRef = useRef(false);

  // Function to start a new game
  const startNewGame = useCallback((diff: Difficulty) => {
    const newSolution = generateSolution();
    const { puzzle } = createPuzzle(newSolution, diff);
    const newBoard = createBoard(puzzle);
    
    setSolution(newSolution);
    setBoard(newBoard);
    setDifficulty(diff);
    setSelectedCell(null);
    setGameStatus('idle');
    setHasStarted(false);
    setShowWinModal(false);
    setShowNewGameConfirm(false);
    resetTimer();
    clearGame();
  }, [resetTimer, clearGame]);

  // Initialize or restore game
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const saved = loadGame();
    if (saved && saved.board.length > 0) {
      // Restore saved game state
      setBoard(saved.board);
      setSolution(saved.solution);
      setDifficulty(saved.difficulty);
      setGameStatus(saved.gameStatus === 'won' ? 'idle' : saved.gameStatus);
      setHasStarted(saved.hasStarted);
      setTime(saved.timer);
      if (saved.gameStatus === 'playing') {
        start();
      }
    } else {
      // Start new game
      const newSolution = generateSolution();
      const { puzzle } = createPuzzle(newSolution, initialDifficulty);
      const newBoard = createBoard(puzzle);
      setSolution(newSolution);
      setBoard(newBoard);
    }
    setIsInitialized(true);
  }, [initialDifficulty, loadGame, setTime, start]);

  // Save game state on every change
  useEffect(() => {
    if (!isInitialized || board.length === 0) return;
    
    saveGame({
      board,
      solution,
      difficulty,
      timer: seconds,
      gameStatus,
      hasStarted,
    });
  }, [board, solution, difficulty, seconds, gameStatus, hasStarted, isInitialized, saveGame]);

  // Check win condition
  useEffect(() => {
    if (gameStatus === 'playing' && board.length > 0 && isBoardComplete(board)) {
      const isWin = checkWinCondition(board, solution);
      if (isWin) {
        setGameStatus('won');
        pause();
        setShowWinModal(true);
      }
    }
  }, [board, solution, gameStatus, pause]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameStatus === 'idle') {
      setGameStatus('playing');
      setHasStarted(true);
      start();
    }
    setSelectedCell({ row, col });
  }, [gameStatus, start]);

  const handleNumberInput = useCallback((num: number) => {
    if (!selectedCell || gameStatus === 'paused' || gameStatus === 'won') return;
    
    const { row, col } = selectedCell;
    const cell = board[row][col];
    
    if (cell.isFixed) return;

    // Start game on first interaction
    if (!hasStarted) {
      setHasStarted(true);
      setGameStatus('playing');
      start();
    }

    const newValue = num === 0 ? null : num;
    
    setBoard(prevBoard => {
      const newBoard = prevBoard.map((r, rowIndex) =>
        r.map((c, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { ...c, value: newValue };
          }
          return c;
        })
      );
      return validateBoardCells(newBoard);
    });
  }, [selectedCell, board, hasStarted, start, gameStatus]);

  const handlePauseToggle = useCallback(() => {
    if (gameStatus === 'playing') {
      setGameStatus('paused');
      pause();
    } else if (gameStatus === 'paused') {
      setGameStatus('playing');
      start();
    }
  }, [gameStatus, pause, start]);

  const handleNewGameRequest = useCallback(() => {
    if (gameStatus === 'playing' && hasStarted) {
      setShowNewGameConfirm(true);
    } else {
      startNewGame(difficulty);
    }
  }, [gameStatus, hasStarted, difficulty, startNewGame]);

  const confirmNewGame = useCallback(() => {
    startNewGame(difficulty);
  }, [difficulty, startNewGame]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    startNewGame(newDifficulty);
  }, [startNewGame]);

  const handleWinModalClose = useCallback(() => {
    setShowWinModal(false);
  }, []);

  const handleWinModalNewGame = useCallback(() => {
    setShowWinModal(false);
    startNewGame(difficulty);
  }, [difficulty, startNewGame]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus === 'paused' || gameStatus === 'won') return;
      
      if (!selectedCell) return;
      
      const { row, col } = selectedCell;
      let newRow = row;
      let newCol = col;
      
      switch (e.key) {
        case 'ArrowUp':
          newRow = Math.max(0, row - 1);
          e.preventDefault();
          break;
        case 'ArrowDown':
          newRow = Math.min(8, row + 1);
          e.preventDefault();
          break;
        case 'ArrowLeft':
          newCol = Math.max(0, col - 1);
          e.preventDefault();
          break;
        case 'ArrowRight':
          newCol = Math.min(8, col + 1);
          e.preventDefault();
          break;
        default:
          return;
      }
      
      setSelectedCell({ row: newRow, col: newCol });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, gameStatus]);

  if (board.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <GameControls
        timer={formattedTime}
        gameStatus={gameStatus}
        difficulty={difficulty}
        onPauseToggle={handlePauseToggle}
        onNewGame={handleNewGameRequest}
        onDifficultyChange={handleDifficultyChange}
      />

      <div className="relative">
        <div 
          className={cn(
            'grid grid-cols-9 border-2 border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900',
            'w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] md:w-[468px] md:h-[468px]'
          )}
          data-testid="sudoku-board"
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                row={rowIndex}
                col={colIndex}
                isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onNumberInput={handleNumberInput}
                isPaused={gameStatus === 'paused'}
              />
            ))
          )}
        </div>

        {gameStatus === 'paused' && <PauseOverlay />}
      </div>

      {/* Number pad for mobile/touch */}
      <div className="grid grid-cols-5 gap-2 w-full max-w-[340px] sm:max-w-[400px] md:max-w-[468px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            disabled={gameStatus === 'paused' || gameStatus === 'won'}
            className={cn(
              'p-3 rounded-lg font-semibold text-lg transition-colors cursor-pointer',
              'bg-slate-800 text-slate-100 hover:bg-slate-700',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus-visible:ring-2 focus-visible:ring-blue-400 outline-none'
            )}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleNumberInput(0)}
          disabled={gameStatus === 'paused' || gameStatus === 'won'}
          className={cn(
            'p-3 rounded-lg font-semibold text-sm transition-colors cursor-pointer',
            'bg-slate-700 text-slate-300 hover:bg-slate-600',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus-visible:ring-2 focus-visible:ring-blue-400 outline-none'
          )}
        >
          Clear
        </button>
      </div>

      <WinModal
        isOpen={showWinModal}
        completionTime={formattedTime}
        onClose={handleWinModalClose}
        onNewGame={handleWinModalNewGame}
      />

      {/* New Game Confirmation Dialog */}
      {showNewGameConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-slate-100 mb-2">Start New Game?</h3>
            <p className="text-slate-400 mb-6">
              Your current progress will be lost. Are you sure you want to start a new game?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewGameConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmNewGame}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
