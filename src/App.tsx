import { useState } from 'react';
import './App.css';
import type { GameMode, Difficulty, Word } from './types';
import { getRandomWord } from './data/words';
import { updateStatistics } from './utils/statistics';
import ModeSelection from './components/ModeSelection';
import SpellingGame from './components/SpellingGame';
import DefinitionGame from './components/DefinitionGame';
import FillBlankGame from './components/FillBlankGame';
import AnagramGame from './components/AnagramGame';
import StatisticsView from './components/StatisticsView';

type AppView = 'menu' | 'game' | 'stats';

function App() {
  const [view, setView] = useState<AppView>('menu');
  const [currentMode, setCurrentMode] = useState<GameMode | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const handleModeSelect = (mode: GameMode, difficulty: Difficulty) => {
    setCurrentMode(mode);
    setCurrentDifficulty(difficulty);
    setCurrentWord(getRandomWord(difficulty));
    setView('game');
  };

  const handleGameComplete = (correct: boolean, points: number) => {
    const newScore = score + points;
    const newStreak = correct ? streak + 1 : 0;

    setScore(newScore);
    setStreak(newStreak);

    if (currentDifficulty && currentMode && currentWord) {
      updateStatistics(
        correct,
        currentDifficulty,
        currentMode,
        newStreak,
        points,
        correct ? undefined : currentWord.word
      );
    }

    setTimeout(() => {
      if (currentDifficulty) {
        setCurrentWord(getRandomWord(currentDifficulty));
      }
    }, 100);
  };

  const handleBackToMenu = () => {
    setView('menu');
    setCurrentMode(null);
    setCurrentDifficulty(null);
    setCurrentWord(null);
  };

  const handleViewStats = () => {
    setView('stats');
  };

  const handleStatsBack = () => {
    setView('menu');
  };

  const renderGame = () => {
    if (!currentWord || !currentMode || !currentDifficulty) return null;

    switch (currentMode) {
      case 'spelling':
        return (
          <SpellingGame
            word={currentWord}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
          />
        );
      case 'definition':
        return (
          <DefinitionGame
            word={currentWord}
            difficulty={currentDifficulty}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
          />
        );
      case 'fillblank':
        return (
          <FillBlankGame
            word={currentWord}
            difficulty={currentDifficulty}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
          />
        );
      case 'anagram':
        return (
          <AnagramGame
            word={currentWord}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {view === 'menu' && (
        <ModeSelection onSelectMode={handleModeSelect} onViewStats={handleViewStats} />
      )}
      {view === 'game' && (
        <div className="game-view">
          <div className="game-stats">
            <div className="stat">Score: {score}</div>
            <div className="stat">Streak: {streak} 🔥</div>
          </div>
          {renderGame()}
        </div>
      )}
      {view === 'stats' && <StatisticsView onBack={handleStatsBack} />}
    </div>
  );
}

export default App;
