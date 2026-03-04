import { SudokuBoard } from '@/components/sudoku';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 text-center mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Sudoku
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Classic 9x9 Puzzle Game
        </p>
        <SudokuBoard />
      </div>
    </main>
  );
}
