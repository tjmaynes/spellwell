import { createContext, useContext, useState, ReactNode } from 'react';
import type { Word, GameMode, Difficulty } from '../types';

interface GameContextType {
  score: number;
  streak: number;
  correctHistory: Word[];
  currentMode: GameMode | null;
  setScore: (score: number) => void;
  setStreak: (streak: number) => void;
  setCorrectHistory: (history: Word[]) => void;
  setCurrentMode: (mode: GameMode | null) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctHistory, setCorrectHistory] = useState<Word[]>([]);
  const [currentMode, setCurrentMode] = useState<GameMode | null>(null);

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setCorrectHistory([]);
    setCurrentMode(null);
  };

  return (
    <GameContext.Provider
      value={{
        score,
        streak,
        correctHistory,
        currentMode,
        setScore,
        setStreak,
        setCorrectHistory,
        setCurrentMode,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
