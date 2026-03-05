export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type GameState = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";

export interface Position {
  x: number;
  y: number;
}

export interface SnakeState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  gameState: GameState;
  score: number;
  highScore: number;
  speed: number;
}

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  initialSpeed: number;
  speedIncrement: number;
  minSpeed: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  boardWidth: 20,
  boardHeight: 20,
  initialSpeed: 150,
  speedIncrement: 5,
  minSpeed: 50,
};

export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};
