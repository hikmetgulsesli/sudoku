"use client";

import { useEffect, useCallback, useRef } from "react";
import { Direction } from "@/types/snake";

export interface UseGameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onTogglePause: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
}

export interface UseGameControlsReturn {
  /** Whether touch is supported on the current device */
  isTouchSupported: boolean;
}

// Map keyboard keys to directions
const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  w: "UP",
  W: "UP",
  s: "DOWN",
  S: "DOWN",
  a: "LEFT",
  A: "LEFT",
  d: "RIGHT",
  D: "RIGHT",
};

// Keys that should prevent default browser behavior
const GAME_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  " ",
  "Spacebar",
  "w",
  "W",
  "s",
  "S",
  "a",
  "A",
  "d",
  "D",
];

/**
 * Custom hook that encapsulates all game input logic.
 * Handles keyboard controls (Arrow keys, WASD, Spacebar) and touch/swipe gestures.
 * Includes debouncing to prevent rapid direction changes causing self-collision.
 */
export function useGameControls({
  onDirectionChange,
  onTogglePause,
  isPlaying,
  isPaused,
  isGameOver,
}: UseGameControlsProps): UseGameControlsReturn {
  // Track last direction change time for debouncing
  const lastDirectionChange = useRef<number>(0);
  const lastDirection = useRef<Direction | null>(null);
  // Minimum time between direction changes (ms) - prevents rapid changes causing self-collision
  const DEBOUNCE_MS = 50;

  // Touch handling refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  // Minimum swipe distance to trigger direction change
  const SWIPE_THRESHOLD = 30;
  // Maximum time for a swipe gesture (ms)
  const SWIPE_MAX_DURATION = 500;

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;

      // Prevent default browser behavior for game control keys
      if (GAME_KEYS.includes(key)) {
        event.preventDefault();
      }

      // Handle pause/resume with Spacebar
      if (key === " " || key === "Spacebar") {
        // Only toggle pause if game is active or paused (not on game over or idle)
        if (isPlaying || isPaused) {
          onTogglePause();
        }
        return;
      }

      // Handle direction changes
      const direction = KEY_TO_DIRECTION[key];
      if (!direction) return;

      // Debounce direction changes to prevent self-collision
      const now = Date.now();
      if (
        now - lastDirectionChange.current < DEBOUNCE_MS &&
        lastDirection.current === direction
      ) {
        return;
      }

      lastDirectionChange.current = now;
      lastDirection.current = direction;
      onDirectionChange(direction);
    },
    [onDirectionChange, onTogglePause, isPlaying, isPaused]
  );

  // Handle touch start
  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchStartTime.current = Date.now();
  }, []);

  // Handle touch end and detect swipe direction
  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      // Only process if game is active
      if (!isPlaying && !isPaused) return;

      const touch = event.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();

      // Check if this was a quick swipe
      if (endTime - touchStartTime.current > SWIPE_MAX_DURATION) {
        touchStartX.current = null;
        touchStartY.current = null;
        return;
      }

      if (touchStartX.current === null || touchStartY.current === null) {
        return;
      }

      const deltaX = endX - touchStartX.current;
      const deltaY = endY - touchStartY.current;

      // Determine swipe direction based on larger delta
      let direction: Direction | null = null;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
          direction = deltaX > 0 ? "RIGHT" : "LEFT";
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) >= SWIPE_THRESHOLD) {
          direction = deltaY > 0 ? "DOWN" : "UP";
        }
      }

      // Reset touch tracking
      touchStartX.current = null;
      touchStartY.current = null;

      if (direction) {
        // Debounce direction changes
        const now = Date.now();
        if (
          now - lastDirectionChange.current < DEBOUNCE_MS &&
          lastDirection.current === direction
        ) {
          return;
        }

        lastDirectionChange.current = now;
        lastDirection.current = direction;
        onDirectionChange(direction);
      }
    },
    [onDirectionChange, isPlaying, isPaused]
  );

  // Setup keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Setup touch event listeners on the game board element
  useEffect(() => {
    // Touch events need to be attached to a specific element
    // We'll use a data attribute to find the game board
    const gameBoard = document.querySelector('[data-game-board="snake"]');
    if (!gameBoard) return;

    gameBoard.addEventListener("touchstart", handleTouchStart as EventListener, { passive: true });
    gameBoard.addEventListener("touchend", handleTouchEnd as EventListener, { passive: true });

    return () => {
      gameBoard.removeEventListener("touchstart", handleTouchStart as EventListener);
      gameBoard.removeEventListener("touchend", handleTouchEnd as EventListener);
    };
  }, [handleTouchStart, handleTouchEnd]);

  // Check if touch is supported
  const isTouchSupported =
    typeof window !== "undefined" && "ontouchstart" in window;

  return { isTouchSupported };
}
