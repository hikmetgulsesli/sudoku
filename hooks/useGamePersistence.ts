import { useCallback } from 'react';
import { Difficulty, Board } from '@/types/sudoku';

const STORAGE_KEY = 'sudoku-game-state';

export interface SavedGameState {
  board: Board;
  solution: number[][];
  difficulty: Difficulty;
  timer: number;
  gameStatus: 'idle' | 'playing' | 'paused' | 'won';
  hasStarted: boolean;
}

export function useGamePersistence() {
  const saveGame = useCallback((state: SavedGameState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }, []);

  const loadGame = useCallback((): SavedGameState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
    return null;
  }, []);

  const clearGame = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear game state:', error);
    }
  }, []);

  return { saveGame, loadGame, clearGame };
}
