"use client";

import * as React from "react";
import { useGame } from "@/hooks/useGame";
import {
  Header,
  GameStats,
  NumberPad,
  SudokuBoard,
  WinModal,
} from "@/components/sudoku";
import { Button } from "@/components/ui/button";
import { type Difficulty } from "@/types/sudoku";

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
    difficulty,
    setDifficulty,
    timer,
    moves,
    isComplete,
    newGame,
    clearCell,
    canUndo,
    undo,
    completedNumbers,
  } = useGame();

  const [showWinModal, setShowWinModal] = React.useState(false);

  // Show win modal when game is complete
  React.useEffect(() => {
    if (isComplete) {
      setShowWinModal(true);
    }
  }, [isComplete]);

  // Calculate remaining cells
  const remainingCells = React.useMemo(() => {
    let count = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col].value === null) {
          count++;
        }
      }
    }
    return count;
  }, [board]);

  // Handle number pad selection
  const handleNumberSelect = React.useCallback(
    (num: number) => {
      if (selectedCell) {
        setCellValue(num);
      }
    },
    [selectedCell, setCellValue]
  );

  // Handle keyboard input
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys 1-9
      if (e.key >= "1" && e.key <= "9") {
        handleNumberSelect(parseInt(e.key, 10));
      }
      // Delete or Backspace to clear
      else if (e.key === "Delete" || e.key === "Backspace") {
        clearCell();
      }
      // Arrow keys to navigate
      else if (selectedCell) {
        const { row, col } = selectedCell;
        switch (e.key) {
          case "ArrowUp":
            if (row > 0) selectCell(row - 1, col);
            break;
          case "ArrowDown":
            if (row < 8) selectCell(row + 1, col);
            break;
          case "ArrowLeft":
            if (col > 0) selectCell(row, col - 1);
            break;
          case "ArrowRight":
            if (col < 8) selectCell(row, col + 1);
            break;
        }
      }
      // Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNumberSelect, clearCell, selectedCell, selectCell, undo]);

  // Handle difficulty change
  const handleDifficultyChange = React.useCallback(
    (newDifficulty: Difficulty) => {
      setDifficulty(newDifficulty);
    },
    [setDifficulty]
  );

  // Handle play again
  const handlePlayAgain = React.useCallback(() => {
    setShowWinModal(false);
    newGame();
  }, [newGame]);

  // Handle main menu (just starts new game for now)
  const handleMainMenu = React.useCallback(() => {
    setShowWinModal(false);
    newGame();
  }, [newGame]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        timer={formatTime(timer)}
        onPause={() => {}}
        onSettings={() => {}}
      />

      {/* Main Game Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Left: Game Board */}
            <div className="flex-1 w-full flex justify-center">
              <SudokuBoard
                board={board}
                selectedCell={selectedCell}
                onCellClick={selectCell}
                className="w-full max-w-fit"
              />
            </div>

            {/* Right: Controls & Stats */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
              {/* Game Stats */}
              <GameStats
                timer={formatTime(timer)}
                difficulty={difficulty}
                remainingCells={remainingCells}
                moves={moves}
              />

              {/* Number Pad - Hidden on very small screens, shown on mobile+ */}
              <NumberPad
                onNumberSelect={handleNumberSelect}
                selectedNumber={
                  selectedCell
                    ? board[selectedCell.row][selectedCell.col].value
                    : null
                }
                disabledNumbers={completedNumbers}
              />

              {/* Action Buttons */}
              <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-3">
                <h3 className="font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={undo}
                    disabled={!canUndo}
                    variant="outline"
                    className="w-full cursor-pointer"
                    size="sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                      aria-hidden="true"
                    >
                      <path d="M3 7v6h6" />
                      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                    </svg>
                    Undo
                  </Button>
                  <Button
                    onClick={clearCell}
                    disabled={!selectedCell}
                    variant="outline"
                    className="w-full cursor-pointer"
                    size="sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    Clear
                  </Button>
                </div>
                <Button
                  onClick={newGame}
                  variant="default"
                  className="w-full cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                    aria-hidden="true"
                  >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 16h5v5" />
                  </svg>
                  New Game
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Win Modal */}
      <WinModal
        isOpen={showWinModal}
        time={formatTime(timer)}
        difficulty={difficulty}
        hintsUsed={0}
        totalHints={3}
        moves={moves}
        isNewRecord={false}
        onPlayAgain={handlePlayAgain}
        onMainMenu={handleMainMenu}
      />
    </div>
  );
}
