import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../useTimer';
import { useGamePersistence } from '../useGamePersistence';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with 0 seconds and not running', () => {
    const { result } = renderHook(() => useTimer());
    
    expect(result.current.seconds).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.formattedTime).toBe('00:00');
  });

  it('should start timer when start is called', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    
    expect(result.current.isRunning).toBe(true);
  });

  it('should increment seconds every second when running', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(result.current.seconds).toBe(3);
  });

  it('should pause timer when pause is called', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    act(() => {
      result.current.pause();
    });
    
    expect(result.current.isRunning).toBe(false);
    expect(result.current.seconds).toBe(2);
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(result.current.seconds).toBe(2);
  });

  it('should reset timer to 0 when reset is called', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.seconds).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it('should set time directly when setTime is called', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.setTime(120);
    });
    
    expect(result.current.seconds).toBe(120);
  });

  it('should format time correctly as MM:SS', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.setTime(0);
    });
    expect(result.current.formattedTime).toBe('00:00');
    
    act(() => {
      result.current.setTime(5);
    });
    expect(result.current.formattedTime).toBe('00:05');
    
    act(() => {
      result.current.setTime(65);
    });
    expect(result.current.formattedTime).toBe('01:05');
    
    act(() => {
      result.current.setTime(1234);
    });
    expect(result.current.formattedTime).toBe('20:34');
  });
});

describe('useGamePersistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save game state to localStorage', () => {
    const { result } = renderHook(() => useGamePersistence());
    
    const gameState = {
      board: [],
      solution: [[1]],
      difficulty: 'medium' as const,
      timer: 120,
      gameStatus: 'playing' as const,
      hasStarted: true,
    };
    
    act(() => {
      result.current.saveGame(gameState);
    });
    
    const saved = localStorage.getItem('sudoku-game-state');
    expect(saved).not.toBeNull();
    expect(JSON.parse(saved!)).toEqual(gameState);
  });

  it('should load game state from localStorage', () => {
    const { result } = renderHook(() => useGamePersistence());
    
    const gameState = {
      board: [],
      solution: [[1]],
      difficulty: 'hard' as const,
      timer: 300,
      gameStatus: 'paused' as const,
      hasStarted: true,
    };
    
    localStorage.setItem('sudoku-game-state', JSON.stringify(gameState));
    
    let loaded;
    act(() => {
      loaded = result.current.loadGame();
    });
    
    expect(loaded).toEqual(gameState);
  });

  it('should return null when no game is saved', () => {
    const { result } = renderHook(() => useGamePersistence());
    
    let loaded;
    act(() => {
      loaded = result.current.loadGame();
    });
    
    expect(loaded).toBeNull();
  });

  it('should clear game state from localStorage', () => {
    const { result } = renderHook(() => useGamePersistence());
    
    localStorage.setItem('sudoku-game-state', JSON.stringify({ timer: 100 }));
    
    act(() => {
      result.current.clearGame();
    });
    
    expect(localStorage.getItem('sudoku-game-state')).toBeNull();
  });
});
