import { useState } from 'react';
import './App.css';
import type { GameMode, Difficulty, Word } from './types';
import { getRandomWord, getRandomWordExcluding } from './data/words';
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
  const [correctHistory, setCorrectHistory] = useState<Word[]>([]);

  const handleModeSelect = (mode: GameMode, difficulty: Difficulty) => {
    setCurrentMode(mode);
    setCurrentDifficulty(difficulty);
    setCurrentWord(getRandomWord(difficulty));
    setCorrectHistory([]);
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

      if (correct) {
        setCorrectHistory(prev => [...prev, currentWord]);
      }
    }

    setTimeout(() => {
      if (currentDifficulty) {
        const wordsToExclude = correct ? [...correctHistory, currentWord!] : correctHistory;
        const nextWord = getRandomWordExcluding(currentDifficulty, wordsToExclude);

        if (nextWord) {
          setCurrentWord(nextWord);
        } else {
          setCurrentWord(null);
        }
      }
    }, 100);
  };

  const handleBackToMenu = () => {
    setView('menu');
    setCurrentMode(null);
    setCurrentDifficulty(null);
    setCurrentWord(null);
    setCorrectHistory([]);
  };

  const handleViewStats = () => {
    setView('stats');
  };

  const handleStatsBack = () => {
    setView('menu');
  };

  const renderGame = () => {
    if (!currentMode || !currentDifficulty) return null;

    if (!currentWord) {
      return (
        <div className="completion-message">
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You've completed all words for this difficulty level!</p>
          <div className="completion-stats">
            <div className="completion-stat">
              <div className="stat-value">{correctHistory.length}</div>
              <div className="stat-label">Words Mastered</div>
            </div>
            <div className="completion-stat">
              <div className="stat-value">{score}</div>
              <div className="stat-label">Total Score</div>
            </div>
          </div>
          <button className="back-button" onClick={handleBackToMenu}>
            Back to Menu
          </button>
        </div>
      );
    }

    switch (currentMode) {
      case 'spelling':
        return (
          <SpellingGame
            word={currentWord}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
            correctHistory={correctHistory}
          />
        );
      case 'definition':
        return (
          <DefinitionGame
            word={currentWord}
            difficulty={currentDifficulty}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
            correctHistory={correctHistory}
          />
        );
      case 'fillblank':
        return (
          <FillBlankGame
            word={currentWord}
            difficulty={currentDifficulty}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
            correctHistory={correctHistory}
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
