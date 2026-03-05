"use client";

import { SnakeBoard } from "./SnakeBoard";
import { useSnakeGame } from "@/hooks/useSnakeGame";
import { useGameControls } from "@/hooks/useGameControls";
import { GameConfig, DEFAULT_CONFIG } from "@/types/snake";
import { Play, Pause, RotateCcw, Trophy } from "lucide-react";

interface SnakeGameProps {
  config?: Partial<GameConfig>;
}

export function SnakeGame({ config }: SnakeGameProps) {
  const {
    snake,
    food,
    score,
    highScore,
    gameState,
    startGame,
    resetGame,
    togglePause,
    changeDirection,
    isPlaying,
    isPaused,
    isGameOver,
    isIdle,
  } = useSnakeGame(config);

  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // Setup game controls
  useGameControls({
    onDirectionChange: changeDirection,
    onTogglePause: togglePause,
    isPlaying,
    isPaused,
    isGameOver,
  });

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-400 mb-2">Snake</h1>
        <p className="text-slate-400">Use Arrow keys or WASD to move</p>
      </div>

      {/* Score Board */}
      <div className="flex gap-8 text-center">
        <div className="bg-slate-800 px-4 py-2 rounded-lg">
          <div className="text-slate-400 text-sm">Score</div>
          <div className="text-2xl font-bold text-green-400" data-testid="score">
            {score}
          </div>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <div>
            <div className="text-slate-400 text-sm">High Score</div>
            <div
              className="text-2xl font-bold text-yellow-400"
              data-testid="high-score"
            >
              {highScore}
            </div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <SnakeBoard
        snake={snake}
        food={food}
        boardWidth={mergedConfig.boardWidth}
        boardHeight={mergedConfig.boardHeight}
        isGameOver={isGameOver}
      />

      {/* Game Controls */}
      <div className="flex gap-4">
        {isIdle && (
          <button
            onClick={startGame}
            data-testid="start-button"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-colors"
          >
            <Play className="w-5 h-5" />
            Start Game
          </button>
        )}

        {isPlaying && (
          <button
            onClick={togglePause}
            data-testid="pause-button"
            className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-semibold transition-colors"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}

        {isPaused && (
          <button
            onClick={togglePause}
            data-testid="resume-button"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-colors"
          >
            <Play className="w-5 h-5" />
            Resume
          </button>
        )}

        {(isGameOver || isPaused) && (
          <button
            onClick={isGameOver ? resetGame : startGame}
            data-testid="restart-button"
            className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            {isGameOver ? "New Game" : "Restart"}
          </button>
        )}
      </div>

      {/* Game Over Message */}
      {isGameOver && (
        <div
          data-testid="game-over"
          className="text-center p-4 bg-red-900/30 border border-red-500 rounded-lg"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-1">Game Over!</h2>
          <p className="text-slate-300">Final Score: {score}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-slate-500 text-sm max-w-md">
        <p className="mb-2">
          <strong>Desktop:</strong> Use Arrow keys or WASD to control the snake.
          Press Spacebar to pause/resume.
        </p>
        <p>
          <strong>Mobile:</strong> Swipe on the game board to change direction.
        </p>
      </div>
    </div>
  );
}
