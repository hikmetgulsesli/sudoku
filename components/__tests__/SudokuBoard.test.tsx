import { render, screen, fireEvent } from '@testing-library/react';
import { SudokuBoard } from '../SudokuBoard';
import { CellData } from '../SudokuBoard';

describe('SudokuBoard', () => {
  // Helper to create an empty grid
  const createEmptyGrid = (): CellData[] => {
    return Array(81).fill(null).map(() => ({
      value: null,
      isFixed: false,
      isConflict: false,
    }));
  };

  // Helper to create a grid with sample puzzle
  const createSampleGrid = (): CellData[] => {
    const puzzle = [
      5, 3, 0, 0, 7, 0, 0, 0, 0,
      6, 0, 0, 1, 9, 5, 0, 0, 0,
      0, 9, 8, 0, 0, 0, 0, 6, 0,
      8, 0, 0, 0, 6, 0, 0, 0, 3,
      4, 0, 0, 8, 0, 3, 0, 0, 1,
      7, 0, 0, 0, 2, 0, 0, 0, 6,
      0, 6, 0, 0, 0, 0, 2, 8, 0,
      0, 0, 0, 4, 1, 9, 0, 0, 5,
      0, 0, 0, 0, 8, 0, 0, 7, 9,
    ];
    return puzzle.map((value) => ({
      value: value === 0 ? null : value,
      isFixed: value !== 0,
      isConflict: false,
    }));
  };

  // AC 1: SudokuBoard component renders 9x9 grid with 81 cells
  it('renders 9x9 grid with 81 cells', () => {
    const grid = createEmptyGrid();
    render(<SudokuBoard grid={grid} />);

    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(81);
  });

  // AC 3: Cells display numbers when provided via props
  it('displays numbers in cells when provided', () => {
    const grid = createSampleGrid();
    render(<SudokuBoard grid={grid} />);

    // Cell 0 should have value 5
    const cell0 = screen.getByTestId('cell-0');
    expect(cell0).toHaveTextContent('5');

    // Cell 2 should be empty (value 0 in puzzle)
    const cell2 = screen.getByTestId('cell-2');
    expect(cell2).toHaveTextContent('');
  });

  // AC 4: Selected cell has distinct visual highlight
  it('highlights selected cell', () => {
    const grid = createSampleGrid();
    render(<SudokuBoard grid={grid} selectedIndex={0} />);

    const cell0 = screen.getByTestId('cell-0');
    expect(cell0).toHaveAttribute('data-selected', 'true');

    const cell1 = screen.getByTestId('cell-1');
    expect(cell1).toHaveAttribute('data-selected', 'false');
  });

  // AC 5: Cells in same row/column/box as selected are subtly highlighted
  it('highlights cells in same row as selected', () => {
    const grid = createSampleGrid();
    render(<SudokuBoard grid={grid} selectedIndex={0} />);

    // Cell 0 is at row 0, col 0
    // Cells in same row (0-8) should be highlighted
    const cell1 = screen.getByTestId('cell-1'); // same row
    expect(cell1).toHaveAttribute('data-highlighted', 'true');

    const cell30 = screen.getByTestId('cell-30'); // different row, col, and box
    expect(cell30).toHaveAttribute('data-highlighted', 'false');
  });

  it('highlights cells in same column as selected', () => {
    const grid = createSampleGrid();
    render(<SudokuBoard grid={grid} selectedIndex={0} />);

    // Cell 0 is at row 0, col 0
    // Cells in same column (0, 9, 18, 27, 36, 45, 54, 63, 72) should be highlighted
    const cell9 = screen.getByTestId('cell-9'); // same column
    expect(cell9).toHaveAttribute('data-highlighted', 'true');
  });

  it('highlights cells in same 3x3 box as selected', () => {
    const grid = createSampleGrid();
    render(<SudokuBoard grid={grid} selectedIndex={0} />);

    // Cell 0 is in top-left 3x3 box (cells 0,1,2, 9,10,11, 18,19,20)
    const cell10 = screen.getByTestId('cell-10'); // same box
    expect(cell10).toHaveAttribute('data-highlighted', 'true');
  });

  // AC 6: Cells with conflicts show error styling
  it('shows conflict styling for cells with conflicts', () => {
    const grid = createSampleGrid();
    grid[0].isConflict = true;
    render(<SudokuBoard grid={grid} />);

    const cell0 = screen.getByTestId('cell-0');
    expect(cell0).toHaveAttribute('data-conflict', 'true');
  });

  // AC 8: Typecheck passes (this is verified by the build)
  // AC 9: Tests for SudokuBoard component pass (these tests)

  // Additional tests
  it('calls onCellClick when a cell is clicked', () => {
    const grid = createSampleGrid();
    const onCellClick = jest.fn();
    render(<SudokuBoard grid={grid} onCellClick={onCellClick} />);

    const cell0 = screen.getByTestId('cell-0');
    fireEvent.click(cell0);

    expect(onCellClick).toHaveBeenCalledWith(0);
  });

  it('marks fixed cells correctly', () => {
    const grid = createSampleGrid();
    render(<SudokuBoard grid={grid} />);

    const cell0 = screen.getByTestId('cell-0'); // has value 5, is fixed
    expect(cell0).toHaveAttribute('data-fixed', 'true');

    const cell2 = screen.getByTestId('cell-2'); // empty, not fixed
    expect(cell2).toHaveAttribute('data-fixed', 'false');
  });

  it('has proper accessibility labels', () => {
    const grid = createSampleGrid();
    render(<SudokuBoard grid={grid} />);

    const cell0 = screen.getByTestId('cell-0');
    expect(cell0).toHaveAttribute('aria-label', 'Cell row 1, column 1, value 5');

    const cell2 = screen.getByTestId('cell-2');
    expect(cell2).toHaveAttribute('aria-label', 'Cell row 1, column 3, empty');
  });

  it('responds to keyboard interaction', () => {
    const grid = createSampleGrid();
    const onCellClick = jest.fn();
    render(<SudokuBoard grid={grid} onCellClick={onCellClick} />);

    const cell0 = screen.getByTestId('cell-0');
    fireEvent.keyDown(cell0, { key: 'Enter' });

    expect(onCellClick).toHaveBeenCalledWith(0);
  });

  it('renders with custom test ID', () => {
    const grid = createEmptyGrid();
    render(<SudokuBoard grid={grid} data-testid="custom-board" />);

    expect(screen.getByTestId('custom-board')).toBeInTheDocument();
  });

  it('handles empty selection gracefully', () => {
    const grid = createSampleGrid();
    render(<SudokuBoard grid={grid} selectedIndex={null} />);

    // All cells should not be highlighted when nothing is selected
    const cells = screen.getAllByRole('button');
    cells.forEach((cell) => {
      expect(cell).toHaveAttribute('data-selected', 'false');
      expect(cell).toHaveAttribute('data-highlighted', 'false');
    });
  });
});
