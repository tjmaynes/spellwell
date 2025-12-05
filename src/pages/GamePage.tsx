import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { GameMode, Difficulty, Word } from '../types';
import { getRandomWordExcluding } from '../data/words';
import { updateStatistics } from '../utils/statistics';
import { useGame } from '../context/GameContext';
import SpellingGame from '../components/SpellingGame';
import DefinitionGame from '../components/DefinitionGame';
import FillBlankGame from '../components/FillBlankGame';
import AnagramGame from '../components/AnagramGame';

export default function GamePage() {
  const { mode, difficulty } = useParams<{ mode: GameMode; difficulty: Difficulty }>();
  const navigate = useNavigate();
  const {
    score,
    streak,
    correctHistory,
    currentMode,
    setScore,
    setStreak,
    setCorrectHistory,
    setCurrentMode
  } = useGame();

  const [currentWord, setCurrentWord] = useState<Word | null>(null);

  useEffect(() => {
    if (!mode || !difficulty) {
      navigate('/');
      return;
    }

    if (mode !== currentMode) {
      setCurrentMode(mode as GameMode);
      setCorrectHistory([]);
    }

    const word = getRandomWordExcluding(difficulty as Difficulty, correctHistory);
    setCurrentWord(word);
  }, [mode, difficulty, currentMode, setCurrentMode, setCorrectHistory, correctHistory, navigate]);

  const handleGameComplete = (correct: boolean, points: number) => {
    if (!currentWord || !difficulty || !mode) return;

    const newScore = score + points;
    const newStreak = correct ? streak + 1 : 0;

    setScore(newScore);
    setStreak(newStreak);

    updateStatistics(
      correct,
      difficulty as Difficulty,
      mode as GameMode,
      newStreak,
      points,
      correct ? undefined : currentWord.word
    );

    if (correct) {
      setCorrectHistory(prev => [...prev, currentWord]);
    }

    setTimeout(() => {
      const wordsToExclude = correct ? [...correctHistory, currentWord] : correctHistory;
      const nextWord = getRandomWordExcluding(difficulty as Difficulty, wordsToExclude);

      if (nextWord) {
        setCurrentWord(nextWord);
      } else {
        // Navigate to completion page
        navigate(`/game/${mode}/${difficulty}/complete`);
      }
    }, 100);
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  if (!currentWord) {
    return <div>Loading...</div>;
  }

  const renderGame = () => {
    switch (mode) {
      case 'spelling':
        return (
          <SpellingGame
            word={currentWord}
            difficulty={difficulty as Difficulty}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
            correctHistory={correctHistory}
          />
        );
      case 'definition':
        return (
          <DefinitionGame
            word={currentWord}
            difficulty={difficulty as Difficulty}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
            correctHistory={correctHistory}
          />
        );
      case 'fillblank':
        return (
          <FillBlankGame
            word={currentWord}
            difficulty={difficulty as Difficulty}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
            correctHistory={correctHistory}
          />
        );
      case 'anagram':
        return (
          <AnagramGame
            word={currentWord}
            difficulty={difficulty as Difficulty}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex gap-8 justify-center mb-8 text-xl font-semibold">
        <div
          className="px-6 py-3 rounded-lg"
          style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
        >
          Score: {score}
        </div>
        <div
          className="px-6 py-3 rounded-lg"
          style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
        >
          Streak: {streak} 🔥
        </div>
      </div>
      {renderGame()}
    </div>
  );
}
