import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';
import { GameStats } from '../GameStats';
import { NumberPad } from '../NumberPad';
import { SudokuBoard } from '../SudokuBoard';
import { WinModal } from '../WinModal';
import type { Board, Difficulty } from '@/types/sudoku';

// Mock Radix UI Select
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: { children: React.ReactNode; value: string; onValueChange?: (value: string) => void }) => (
    <select 
      data-testid="difficulty-select" 
      value={value} 
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => <option value={value}>{children}</option>,
  SelectValue: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Header', () => {
  const mockDifficultyChange = vi.fn();
  const mockPause = vi.fn();
  const mockSettings = vi.fn();

  const defaultProps = {
    difficulty: 'medium' as Difficulty,
    onDifficultyChange: mockDifficultyChange,
    timer: '12:45',
    onPause: mockPause,
    onSettings: mockSettings,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Sudoku')).toBeInTheDocument();
  });

  it('displays the timer', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('12:45')).toBeInTheDocument();
  });

  it('calls onPause when pause button is clicked', () => {
    render(<Header {...defaultProps} />);
    const pauseButton = screen.getByLabelText('Pause game');
    fireEvent.click(pauseButton);
    expect(mockPause).toHaveBeenCalled();
  });

  it('calls onSettings when settings button is clicked', () => {
    render(<Header {...defaultProps} />);
    const settingsButton = screen.getByLabelText('Settings');
    fireEvent.click(settingsButton);
    expect(mockSettings).toHaveBeenCalled();
  });

  it('renders with custom title', () => {
    render(<Header {...defaultProps} title="Custom Sudoku" />);
    expect(screen.getByText('Custom Sudoku')).toBeInTheDocument();
  });

  it('is accessible with proper ARIA labels', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByLabelText('Game timer')).toBeInTheDocument();
    expect(screen.getByLabelText('Pause game')).toBeInTheDocument();
    expect(screen.getByLabelText('Settings')).toBeInTheDocument();
  });
});

describe('GameStats', () => {
  const defaultProps = {
    timer: '12:45',
    difficulty: 'medium' as Difficulty,
    remainingCells: 45,
    hintsUsed: 1,
    totalHints: 3,
    moves: 12,
  };

  it('renders timer', () => {
    render(<GameStats {...defaultProps} />);
    expect(screen.getByText('12:45')).toBeInTheDocument();
  });

  it('renders difficulty', () => {
    render(<GameStats {...defaultProps} />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders remaining cells count', () => {
    render(<GameStats {...defaultProps} />);
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('renders hints used', () => {
    render(<GameStats {...defaultProps} />);
    expect(screen.getByText('Hints: 1/3')).toBeInTheDocument();
  });

  it('renders moves count', () => {
    render(<GameStats {...defaultProps} />);
    expect(screen.getByText('Moves: 12')).toBeInTheDocument();
  });

  it('calculates progress correctly', () => {
    render(<GameStats {...defaultProps} remainingCells={36} />);
    // 81 - 36 = 45 filled, 45/81 = 55.55...% rounded to 56%
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '56');
  });

  it('is accessible with proper ARIA labels', () => {
    render(<GameStats {...defaultProps} />);
    expect(screen.getByRole('region', { name: 'Game statistics' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Puzzle completion progress');
  });
});

describe('NumberPad', () => {
  const mockSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 9 number buttons', () => {
    render(<NumberPad onNumberSelect={mockSelect} />);
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByLabelText(`Select number ${i}`)).toBeInTheDocument();
    }
  });

  it('calls onNumberSelect when a number is clicked', () => {
    render(<NumberPad onNumberSelect={mockSelect} />);
    fireEvent.click(screen.getByLabelText('Select number 5'));
    expect(mockSelect).toHaveBeenCalledWith(5);
  });

  it('disables numbers in disabledNumbers array', () => {
    render(<NumberPad onNumberSelect={mockSelect} disabledNumbers={[1, 2, 3]} />);
    expect(screen.getByLabelText('Select number 1')).toBeDisabled();
    expect(screen.getByLabelText('Select number 2')).toBeDisabled();
    expect(screen.getByLabelText('Select number 3')).toBeDisabled();
    expect(screen.getByLabelText('Select number 4')).not.toBeDisabled();
  });

  it('does not call onNumberSelect for disabled numbers', () => {
    render(<NumberPad onNumberSelect={mockSelect} disabledNumbers={[5]} />);
    fireEvent.click(screen.getByLabelText('Select number 5'));
    expect(mockSelect).not.toHaveBeenCalled();
  });

  it('is accessible with proper ARIA labels', () => {
    render(<NumberPad onNumberSelect={mockSelect} />);
    expect(screen.getByRole('group', { name: 'Number pad' })).toBeInTheDocument();
  });
});

describe('SudokuBoard', () => {
  const createEmptyBoard = (): Board => {
    return Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => ({
        value: null,
        isFixed: false,
        isValid: true,
        notes: [],
      }))
    );
  };

  const createTestBoard = (): Board => {
    const board = createEmptyBoard();
    // Add some fixed cells
    board[0][0] = { value: 5, isFixed: true, isValid: true, notes: [] };
    board[0][1] = { value: 3, isFixed: true, isValid: true, notes: [] };
    // Add a user cell
    board[0][2] = { value: 4, isFixed: false, isValid: true, notes: [] };
    return board;
  };

  const mockCellClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a 9x9 grid', () => {
    const board = createTestBoard();
    render(
      <SudokuBoard
        board={board}
        selectedCell={null}
        onCellClick={mockCellClick}
      />
    );
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('renders cell values', () => {
    const board = createTestBoard();
    render(
      <SudokuBoard
        board={board}
        selectedCell={null}
        onCellClick={mockCellClick}
      />
    );
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('calls onCellClick when a cell is clicked', () => {
    const board = createTestBoard();
    render(
      <SudokuBoard
        board={board}
        selectedCell={null}
        onCellClick={mockCellClick}
      />
    );
    const cell = screen.getByLabelText('Cell 1,1: 5');
    fireEvent.click(cell);
    expect(mockCellClick).toHaveBeenCalledWith(0, 0);
  });

  it('is accessible with proper ARIA labels', () => {
    const board = createTestBoard();
    render(
      <SudokuBoard
        board={board}
        selectedCell={null}
        onCellClick={mockCellClick}
      />
    );
    expect(screen.getByRole('grid', { name: 'Sudoku puzzle grid' })).toBeInTheDocument();
    expect(screen.getByLabelText('Cell 1,1: 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Empty cell 2,4')).toBeInTheDocument();
  });
});

describe('WinModal', () => {
  const mockPlayAgain = vi.fn();
  const mockMainMenu = vi.fn();

  const defaultProps = {
    isOpen: true,
    time: '08:42',
    difficulty: 'medium' as Difficulty,
    hintsUsed: 1,
    totalHints: 3,
    moves: 25,
    isNewRecord: false,
    onPlayAgain: mockPlayAgain,
    onMainMenu: mockMainMenu,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<WinModal {...defaultProps} />);
    expect(screen.getByText('Puzzle Solved!')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<WinModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Puzzle Solved!')).not.toBeInTheDocument();
  });

  it('displays the completion time', () => {
    render(<WinModal {...defaultProps} />);
    // Use getAllByText since the time appears in multiple places
    expect(screen.getAllByText('08:42').length).toBeGreaterThan(0);
    expect(screen.getByText('Your Time')).toBeInTheDocument();
  });

  it('displays difficulty', () => {
    render(<WinModal {...defaultProps} />);
    expect(screen.getAllByText('Medium').length).toBeGreaterThan(0);
  });

  it('displays game statistics', () => {
    render(<WinModal {...defaultProps} />);
    expect(screen.getByText('1/3')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('calls onPlayAgain when Play Again button is clicked', () => {
    render(<WinModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Play Again/i }));
    expect(mockPlayAgain).toHaveBeenCalled();
  });

  it('calls onMainMenu when Main Menu button is clicked', () => {
    render(<WinModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Main Menu/i }));
    expect(mockMainMenu).toHaveBeenCalled();
  });

  it('shows new record badge when isNewRecord is true', () => {
    render(<WinModal {...defaultProps} isNewRecord={true} />);
    expect(screen.getByText('New Personal Best!')).toBeInTheDocument();
  });

  it('is accessible with proper ARIA attributes', () => {
    render(<WinModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});
