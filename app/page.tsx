import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-slate-50">Sudoku</CardTitle>
          <CardDescription className="text-slate-400">
            Classic 9x9 Puzzle Game
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300 text-center">
            Choose your difficulty level and start playing!
          </p>
          <div className="flex flex-col gap-2">
            <Button className="w-full cursor-pointer" size="lg">
              Easy
            </Button>
            <Button className="w-full cursor-pointer" variant="secondary" size="lg">
              Medium
            </Button>
            <Button className="w-full cursor-pointer" variant="outline" size="lg">
              Hard
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
