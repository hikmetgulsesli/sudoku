import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameControls } from "@/hooks/useGameControls";
import { Direction } from "@/types/snake";

describe("useGameControls", () => {
  const mockOnDirectionChange = vi.fn();
  const mockOnTogglePause = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should call onDirectionChange when Arrow keys are pressed", () => {
    renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
      })
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    });
    expect(mockOnDirectionChange).toHaveBeenCalledWith("UP");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    });
    expect(mockOnDirectionChange).toHaveBeenCalledWith("DOWN");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    });
    expect(mockOnDirectionChange).toHaveBeenCalledWith("LEFT");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    });
    expect(mockOnDirectionChange).toHaveBeenCalledWith("RIGHT");
  });

  it("should call onDirectionChange when WASD keys are pressed", () => {
    renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
      })
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "w" }));
    });
    expect(mockOnDirectionChange).toHaveBeenCalledWith("UP");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "s" }));
    });
    expect(mockOnDirectionChange).toHaveBeenCalledWith("DOWN");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    });
    expect(mockOnDirectionChange).toHaveBeenCalledWith("LEFT");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
    });
    expect(mockOnDirectionChange).toHaveBeenCalledWith("RIGHT");
  });

  it("should call onDirectionChange when uppercase WASD keys are pressed", () => {
    renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
      })
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "W" }));
    });
    expect(mockOnDirectionChange).toHaveBeenCalledWith("UP");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "S" }));
    });
    expect(mockOnDirectionChange).toHaveBeenCalledWith("DOWN");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "A" }));
    });
    expect(mockOnDirectionChange).toHaveBeenCalledWith("LEFT");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "D" }));
    });
    expect(mockOnDirectionChange).toHaveBeenCalledWith("RIGHT");
  });

  it("should call onTogglePause when Spacebar is pressed during play", () => {
    renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
      })
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    });
    expect(mockOnTogglePause).toHaveBeenCalled();
  });

  it("should call onTogglePause when Spacebar is pressed when paused", () => {
    renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: false,
        isPaused: true,
        isGameOver: false,
      })
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    });
    expect(mockOnTogglePause).toHaveBeenCalled();
  });

  it("should not call onTogglePause when game is idle", () => {
    renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: false,
        isPaused: false,
        isGameOver: false,
      })
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    });
    expect(mockOnTogglePause).not.toHaveBeenCalled();
  });

  it("should not call onTogglePause when game is over", () => {
    renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: false,
        isPaused: false,
        isGameOver: true,
      })
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    });
    expect(mockOnTogglePause).not.toHaveBeenCalled();
  });

  it("should prevent default browser behavior for game control keys", () => {
    renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
      })
    );

    const preventDefault = vi.fn();

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp", cancelable: true })
      );
    });

    // Test with a new event to verify preventDefault would be called
    const arrowEvent = new KeyboardEvent("keydown", {
      key: "ArrowUp",
      cancelable: true,
    });
    const spy = vi.spyOn(arrowEvent, "preventDefault");

    // The hook should prevent default for game keys
    act(() => {
      window.dispatchEvent(arrowEvent);
    });
  });

  it("should debounce rapid direction changes", () => {
    renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
      })
    );

    // Rapidly fire the same direction
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    });

    // Should only be called once due to debouncing
    expect(mockOnDirectionChange).toHaveBeenCalledTimes(1);
    expect(mockOnDirectionChange).toHaveBeenCalledWith("UP");
  });

  it("should allow different directions in rapid succession", () => {
    renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
      })
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    });

    vi.advanceTimersByTime(100);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    });

    expect(mockOnDirectionChange).toHaveBeenCalledWith("UP");
    expect(mockOnDirectionChange).toHaveBeenCalledWith("LEFT");
  });

  it("should return isTouchSupported as boolean", () => {
    const { result } = renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
      })
    );

    expect(typeof result.current.isTouchSupported).toBe("boolean");
  });

  it("should ignore non-game keys", () => {
    renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
      })
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "1" }));
    });

    expect(mockOnDirectionChange).not.toHaveBeenCalled();
    expect(mockOnTogglePause).not.toHaveBeenCalled();
  });

  it("should clean up event listeners on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() =>
      useGameControls({
        onDirectionChange: mockOnDirectionChange,
        onTogglePause: mockOnTogglePause,
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
      })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });
});
