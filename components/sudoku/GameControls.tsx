"use client";

import { Button } from "@/components/ui/button";
import { Undo2, Trash2, RotateCcw } from "lucide-react";

interface GameControlsProps {
  onUndo: () => void;
  onClear: () => void;
  onNewGame: () => void;
  canUndo: boolean;
  hasSelection: boolean;
}

export function GameControls({
  onUndo,
  onClear,
  onNewGame,
  canUndo,
  hasSelection,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-2" data-testid="game-controls">
      <Button
        variant="secondary"
        onClick={onUndo}
        disabled={!canUndo}
        className="w-full cursor-pointer"
        data-testid="undo-btn"
      >
        <Undo2 className="w-4 h-4 mr-2" />
        Undo
      </Button>
      
      <Button
        variant="secondary"
        onClick={onClear}
        disabled={!hasSelection}
        className="w-full cursor-pointer"
        data-testid="clear-btn"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clear Cell
      </Button>
      
      <Button
        variant="outline"
        onClick={onNewGame}
        className="w-full cursor-pointer"
        data-testid="new-game-btn"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        New Game
      </Button>
    </div>
  );
}
