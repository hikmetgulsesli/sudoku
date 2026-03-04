import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Sudoku - Classic 9x9 Puzzle Game | Free Online Sudoku",
  description: "Play free classic 9x9 Sudoku puzzles online. Choose from Easy, Medium, or Hard difficulty levels. Features timer, hints, and responsive design for mobile and desktop.",
  keywords: ["sudoku", "puzzle", "game", "9x9", "classic sudoku", "brain game", "logic puzzle"],
  authors: [{ name: "Sudoku Game" }],
  openGraph: {
    title: "Sudoku - Classic 9x9 Puzzle Game",
    description: "Play free classic Sudoku puzzles with multiple difficulty levels",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudoku - Classic 9x9 Puzzle Game",
    description: "Play free classic Sudoku puzzles with multiple difficulty levels",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
