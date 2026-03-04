"use client";

import { useEffect, useCallback } from "react";
import { useGame } from "@/hooks/useGame";
import { SudokuBoard } from "@/components/sudoku/SudokuBoard";
import { NumberPad } from "@/components/sudoku/NumberPad";
import { GameControls } from "@/components/sudoku/GameControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function Home() {
  const {
    board,
    selectedCell,
    selectCell,
    setCellValue,
    canUndo,
    undo,
    difficulty,
    setDifficulty,
    timer,
    moves,
    isComplete,
    completedNumbers,
    newGame,
    clearCell,
  } = useGame();

  // Keyboard input handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Number keys 1-9
      if (e.key >= "1" && e.key <= "9") {
        const num = parseInt(e.key, 10);
        setCellValue(num);
        return;
      }

      // Delete or Backspace to clear
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        clearCell();
        return;
      }

      // Arrow keys for navigation
      if (e.key.startsWith("Arrow") && selectedCell) {
        e.preventDefault();
        const { row, col } = selectedCell;
        let newRow = row;
        let newCol = col;

        switch (e.key) {
          case "ArrowUp":
            newRow = Math.max(0, row - 1);
            break;
          case "ArrowDown":
            newRow = Math.min(8, row + 1);
            break;
          case "ArrowLeft":
            newCol = Math.max(0, col - 1);
            break;
          case "ArrowRight":
            newCol = Math.min(8, col + 1);
            break;
        }

        selectCell(newRow, newCol);
        return;
      }

      // Undo with Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
    },
    [selectedCell, setCellValue, clearCell, selectCell, undo]
  );

  // Attach keyboard listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleNumberClick = (num: number) => {
    setCellValue(num);
  };

  const difficulties: Array<{ value: typeof difficulty; label: string }> = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Sudoku
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Classic 9x9 Puzzle Game
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div
              className="bg-white dark:bg-slate-900 px-6 py-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 text-2xl font-mono text-slate-900 dark:text-slate-100"
              data-testid="timer"
            >
              {formatTime(timer)}
            </div>

            {/* Difficulty Selector */}
            <div className="flex gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
              {difficulties.map((diff) => (
                <Button
                  key={diff.value}
                  variant={difficulty === diff.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDifficulty(diff.value)}
                  className={cn(
                    "cursor-pointer",
                    difficulty === diff.value && "bg-blue-600 text-white"
                  )}
                  data-testid={`difficulty-${diff.value}`}
                >
                  {diff.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Completion Banner */}
        {isComplete && (
          <div
            className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-center"
            data-testid="completion-banner"
          >
            <p className="text-green-800 dark:text-green-200 text-lg font-semibold">
              🎉 Congratulations! You completed the puzzle in {formatTime(timer)}!
            </p>
          </div>
        )}

        {/* Game Area */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Board */}
          <div className="flex justify-center">
            <SudokuBoard
              board={board}
              selectedRow={selectedCell?.row ?? null}
              selectedCol={selectedCell?.col ?? null}
              onCellClick={selectCell}
            />
          </div>

          {/* Controls */}
          <div className="w-full lg:w-80 space-y-4">
            {/* Number Pad */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Number Pad</CardTitle>
              </CardHeader>
              <CardContent>
                <NumberPad
                  onNumberClick={handleNumberClick}
                  completedNumbers={completedNumbers}
                  disabled={!selectedCell}
                />
                <p className="text-xs text-slate-500 mt-3 text-center">
                  Click a cell first, then select a number
                </p>
              </CardContent>
            </Card>

            {/* Game Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <GameControls
                  onUndo={undo}
                  onClear={clearCell}
                  onNewGame={newGame}
                  canUndo={canUndo}
                  hasSelection={!!selectedCell}
                />
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Moves:</span>
                  <span className="font-semibold" data-testid="moves-count">
                    {moves}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <p>• Click a cell to select it</p>
              <p>• Use number pad or keys 1-9 to fill</p>
              <p>• Press Delete or Backspace to clear</p>
              <p>• Use arrow keys to navigate</p>
              <p>• Press Ctrl+Z to undo</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
