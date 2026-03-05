"use client";

import React from "react";
import { Position } from "@/types/snake";

interface SnakeBoardProps {
  snake: Position[];
  food: Position;
  boardWidth: number;
  boardHeight: number;
  isGameOver: boolean;
}

export function SnakeBoard({
  snake,
  food,
  boardWidth,
  boardHeight,
  isGameOver,
}: SnakeBoardProps) {
  const cells: React.ReactElement[] = [];

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
      const isSnakeBody = snake
        .slice(1)
        .some((segment) => segment.x === x && segment.y === y);
      const isFood = food.x === x && food.y === y;

      let cellClass = "w-full h-full rounded-sm ";
      if (isSnakeHead) {
        cellClass += isGameOver
          ? "bg-red-500 "
          : "bg-green-400 border-2 border-green-300 ";
      } else if (isSnakeBody) {
        cellClass += "bg-green-600 ";
      } else if (isFood) {
        cellClass += "bg-red-500 rounded-full animate-pulse ";
      } else {
        cellClass += "bg-slate-800/50 ";
      }

      cells.push(
        <div
          key={`${x}-${y}`}
          className={cellClass}
          data-testid={`cell-${x}-${y}`}
          data-snake-head={isSnakeHead}
          data-snake-body={isSnakeBody}
          data-food={isFood}
        />
      );
    }
  }

  return (
    <div
      data-game-board="snake"
      data-testid="snake-board"
      className="relative bg-slate-900 border-4 border-slate-700 rounded-lg p-2 touch-none select-none"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
        gridTemplateRows: `repeat(${boardHeight}, 1fr)`,
        gap: "2px",
        aspectRatio: `${boardWidth} / ${boardHeight}`,
        maxWidth: "min(90vw, 500px)",
        maxHeight: "min(90vw, 500px)",
      }}
    >
      {cells}
    </div>
  );
}
