import { useState, useEffect } from 'react';
import type { Word, LetterState, Difficulty } from '../types';
import HistoryPanel from './HistoryPanel';

interface SpellingGameProps {
  word: Word;
  difficulty: Difficulty;
  onComplete: (correct: boolean, score: number) => void;
  onBack: () => void;
  correctHistory: Word[];
}

export default function SpellingGame({ word, difficulty, onComplete, onBack, correctHistory }: SpellingGameProps) {
  const maxAttempts = 6;
  const wordLength = word.word.length;

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showHint, setShowHint] = useState(difficulty === 'easy');

  useEffect(() => {
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
    setShowHint(difficulty === 'easy');
  }, [word, difficulty]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === 'Enter') {
        if (currentGuess.length === wordLength) {
          submitGuess();
        }
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentGuess.length < wordLength) {
          setCurrentGuess(prev => prev + e.key.toLowerCase());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameOver, wordLength]);

  const submitGuess = () => {
    if (currentGuess.length !== wordLength) return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    if (currentGuess === word.word.toLowerCase()) {
      setWon(true);
      setGameOver(true);
      const score = (maxAttempts - newGuesses.length + 1) * 10;
      setTimeout(() => onComplete(true, score), 1500);
    } else if (newGuesses.length >= maxAttempts) {
      setGameOver(true);
      setTimeout(() => onComplete(false, 0), 1500);
    }

    setCurrentGuess('');
  };

  const getLetterState = (letter: string, index: number): LetterState['state'] => {
    const targetWord = word.word.toLowerCase();

    if (targetWord[index] === letter) {
      return 'correct';
    }

    if (targetWord.includes(letter)) {
      return 'present';
    }

    return 'absent';
  };

  const renderGuessRow = (guess: string, rowIndex: number) => {
    const letters = guess.split('');

    return (
      <div key={rowIndex} className="guess-row">
        {letters.map((letter, i) => (
          <div
            key={i}
            className={`letter-box ${getLetterState(letter, i)}`}
          >
            {letter.toUpperCase()}
          </div>
        ))}
      </div>
    );
  };

  const renderCurrentGuessRow = () => {
    const letters = currentGuess.split('');
    const emptySlots = wordLength - letters.length;

    return (
      <div className="guess-row current">
        {letters.map((letter, i) => (
          <div key={i} className="letter-box active">
            {letter.toUpperCase()}
          </div>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty-${i}`} className="letter-box empty"></div>
        ))}
      </div>
    );
  };

  const renderEmptyRow = (index: number) => {
    return (
      <div key={`empty-row-${index}`} className="guess-row">
        {Array.from({ length: wordLength }).map((_, i) => (
          <div key={i} className="letter-box empty"></div>
        ))}
      </div>
    );
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h2>Word Spelling</h2>
        <div className="attempts-counter">
          {guesses.length}/{maxAttempts}
        </div>
      </div>

      {difficulty === 'easy' ? (
        <div className="definition-hint">
          <strong>Definition:</strong> {word.definition}
        </div>
      ) : (
        <div className="hint-container">
          {!showHint ? (
            <button className="hint-button" onClick={() => setShowHint(true)}>
              💡 Show Hint
            </button>
          ) : (
            <div className="definition-hint revealed">
              <strong>Definition:</strong> {word.definition}
            </div>
          )}
        </div>
      )}

      <div className="spelling-board">
        {guesses.map((guess, i) => renderGuessRow(guess, i))}
        {!gameOver && guesses.length < maxAttempts && renderCurrentGuessRow()}
        {Array.from({ length: Math.max(0, maxAttempts - guesses.length - (gameOver ? 0 : 1)) }).map((_, i) =>
          renderEmptyRow(i)
        )}
      </div>

      {gameOver && (
        <div className={`result-message ${won ? 'win' : 'lose'}`}>
          {won ? (
            <>
              <h3>Excellent! 🎉</h3>
              <p>You got it in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!</p>
            </>
          ) : (
            <>
              <h3>Good try!</h3>
              <p>The word was: <strong>{word.word}</strong></p>
            </>
          )}
        </div>
      )}

      {!gameOver && (
        <div className="game-instructions">
          Type your guess and press Enter
        </div>
      )}

      <HistoryPanel correctHistory={correctHistory} />
    </div>
  );
}
