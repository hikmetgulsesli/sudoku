"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Direction,
  GameState,
  Position,
  SnakeState,
  GameConfig,
  DEFAULT_CONFIG,
  OPPOSITE_DIRECTIONS,
} from "@/types/snake";

export interface UseSnakeGameReturn {
  // Game state
  snake: Position[];
  food: Position;
  direction: Direction;
  gameState: GameState;
  score: number;
  highScore: number;
  speed: number;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  togglePause: () => void;
  resetGame: () => void;
  changeDirection: (newDirection: Direction) => void;

  // Status helpers
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isIdle: boolean;
}

function generateFood(
  snake: Position[],
  boardWidth: number,
  boardHeight: number
): Position {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * boardWidth),
      y: Math.floor(Math.random() * boardHeight),
    };
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));
  return food;
}

function createInitialState(config: GameConfig): SnakeState {
  const centerX = Math.floor(config.boardWidth / 2);
  const centerY = Math.floor(config.boardHeight / 2);

  return {
    snake: [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY },
    ],
    food: { x: centerX + 3, y: centerY },
    direction: "RIGHT",
    nextDirection: "RIGHT",
    gameState: "IDLE",
    score: 0,
    highScore: 0,
    speed: config.initialSpeed,
  };
}

export function useSnakeGame(
  config: Partial<GameConfig> = {}
): UseSnakeGameReturn {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const configRef = useRef(mergedConfig);

  const [state, setState] = useState<SnakeState>(() =>
    createInitialState(mergedConfig)
  );

  // Load high score from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("snake-high-score");
    if (saved) {
      const highScore = parseInt(saved, 10);
      setState((prev) => ({ ...prev, highScore }));
    }
  }, []);

  // Save high score when it changes
  useEffect(() => {
    if (state.highScore > 0) {
      localStorage.setItem("snake-high-score", state.highScore.toString());
    }
  }, [state.highScore]);

  // Start the game
  const startGame = useCallback(() => {
    setState((prev) => ({
      ...createInitialState(configRef.current),
      highScore: prev.highScore,
      gameState: "PLAYING",
    }));
  }, []);

  // Pause the game
  const pauseGame = useCallback(() => {
    setState((prev) =>
      prev.gameState === "PLAYING" ? { ...prev, gameState: "PAUSED" } : prev
    );
  }, []);

  // Resume the game
  const resumeGame = useCallback(() => {
    setState((prev) =>
      prev.gameState === "PAUSED" ? { ...prev, gameState: "PLAYING" } : prev
    );
  }, []);

  // Toggle pause state
  const togglePause = useCallback(() => {
    setState((prev) => {
      if (prev.gameState === "PLAYING") {
        return { ...prev, gameState: "PAUSED" };
      } else if (prev.gameState === "PAUSED") {
        return { ...prev, gameState: "PLAYING" };
      }
      return prev;
    });
  }, []);

  // Reset the game to idle state
  const resetGame = useCallback(() => {
    setState((prev) => ({
      ...createInitialState(configRef.current),
      highScore: prev.highScore,
      gameState: "IDLE",
    }));
  }, []);

  // Change direction with 180-degree reversal protection
  const changeDirection = useCallback((newDirection: Direction) => {
    setState((prev) => {
      // Prevent 180-degree direction reversals (instant self-collision)
      if (OPPOSITE_DIRECTIONS[newDirection] === prev.direction) {
        return prev;
      }
      return { ...prev, nextDirection: newDirection };
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (state.gameState !== "PLAYING") return;

    const gameLoop = setInterval(() => {
      setState((prev) => {
        const { boardWidth, boardHeight, speedIncrement, minSpeed } =
          configRef.current;

        // Update direction from nextDirection
        const newDirection = prev.nextDirection;

        // Calculate new head position
        const head = prev.snake[0];
        let newHead: Position;

        switch (newDirection) {
          case "UP":
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case "DOWN":
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case "LEFT":
            newHead = { x: head.x - 1, y: head.y };
            break;
          case "RIGHT":
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= boardWidth ||
          newHead.y < 0 ||
          newHead.y >= boardHeight
        ) {
          return {
            ...prev,
            gameState: "GAME_OVER",
            highScore: Math.max(prev.highScore, prev.score),
          };
        }

        // Check self collision
        if (
          prev.snake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          return {
            ...prev,
            gameState: "GAME_OVER",
            highScore: Math.max(prev.highScore, prev.score),
          };
        }

        // Check if food is eaten
        const ateFood = newHead.x === prev.food.x && newHead.y === prev.food.y;

        // Create new snake
        const newSnake = [newHead, ...prev.snake];
        if (!ateFood) {
          newSnake.pop();
        }

        // Generate new food if eaten
        const newFood = ateFood
          ? generateFood(newSnake, boardWidth, boardHeight)
          : prev.food;

        // Calculate new score and speed
        const newScore = ateFood ? prev.score + 10 : prev.score;
        const newSpeed = ateFood
          ? Math.max(minSpeed, prev.speed - speedIncrement)
          : prev.speed;

        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          direction: newDirection,
          score: newScore,
          speed: newSpeed,
        };
      });
    }, state.speed);

    return () => clearInterval(gameLoop);
  }, [state.gameState, state.speed]);

  return {
    snake: state.snake,
    food: state.food,
    direction: state.direction,
    gameState: state.gameState,
    score: state.score,
    highScore: state.highScore,
    speed: state.speed,
    startGame,
    pauseGame,
    resumeGame,
    togglePause,
    resetGame,
    changeDirection,
    isPlaying: state.gameState === "PLAYING",
    isPaused: state.gameState === "PAUSED",
    isGameOver: state.gameState === "GAME_OVER",
    isIdle: state.gameState === "IDLE",
  };
}
