import { useState, useEffect } from 'react';
import type { Word, Difficulty } from '../types';

interface AnagramGameProps {
  word: Word;
  difficulty: Difficulty;
  onComplete: (correct: boolean, score: number) => void;
  onBack: () => void;
}

export default function AnagramGame({ word, difficulty, onComplete, onBack }: AnagramGameProps) {
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(difficulty === 'easy');

  useEffect(() => {
    scrambleWord();
    setUserAnswer([]);
    setRevealed(false);
    setShowHint(difficulty === 'easy');
  }, [word, difficulty]);

  const scrambleWord = () => {
    const letters = word.word.toLowerCase().split('');
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setScrambledLetters(shuffled);
  };

  const handleLetterClick = (index: number) => {
    if (revealed) return;

    const letter = scrambledLetters[index];
    setUserAnswer([...userAnswer, letter]);
    setScrambledLetters(scrambledLetters.filter((_, i) => i !== index));
  };

  const handleAnswerClick = (index: number) => {
    if (revealed) return;

    const letter = userAnswer[index];
    setScrambledLetters([...scrambledLetters, letter]);
    setUserAnswer(userAnswer.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (revealed || userAnswer.length !== word.word.length) return;

    setRevealed(true);
    const guessedWord = userAnswer.join('');
    const correct = guessedWord === word.word.toLowerCase();
    const score = correct ? 15 : 0;

    setTimeout(() => {
      onComplete(correct, score);
    }, 1500);
  };

  const handleShuffle = () => {
    if (revealed) return;
    const shuffled = [...scrambledLetters].sort(() => Math.random() - 0.5);
    setScrambledLetters(shuffled);
  };

  const handleClear = () => {
    if (revealed) return;
    setScrambledLetters([...scrambledLetters, ...userAnswer]);
    setUserAnswer([]);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h2>Anagram Solver</h2>
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

      <div className="anagram-board">
        <div className="answer-area">
          <h3>Your Answer:</h3>
          <div className="letter-tiles">
            {userAnswer.length === 0 ? (
              <div className="placeholder">Tap letters below to build your word</div>
            ) : (
              userAnswer.map((letter, index) => (
                <button
                  key={index}
                  className="letter-tile answer-tile"
                  onClick={() => handleAnswerClick(index)}
                >
                  {letter.toUpperCase()}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="scrambled-area">
          <h3>Available Letters:</h3>
          <div className="letter-tiles">
            {scrambledLetters.map((letter, index) => (
              <button
                key={index}
                className="letter-tile scrambled-tile"
                onClick={() => handleLetterClick(index)}
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="anagram-controls">
          <button className="control-btn" onClick={handleShuffle} disabled={revealed}>
            🔀 Shuffle
          </button>
          <button className="control-btn" onClick={handleClear} disabled={revealed}>
            ✖️ Clear
          </button>
          <button
            className="control-btn submit-btn"
            onClick={handleSubmit}
            disabled={revealed || userAnswer.length !== word.word.length}
          >
            ✓ Submit
          </button>
        </div>
      </div>

      {revealed && (
        <div className={`result-message ${userAnswer.join('') === word.word.toLowerCase() ? 'win' : 'lose'}`}>
          {userAnswer.join('') === word.word.toLowerCase() ? (
            <>
              <h3>Amazing! 🎉</h3>
              <p>You unscrambled the word correctly!</p>
            </>
          ) : (
            <>
              <h3>Good try!</h3>
              <p>The correct word was: <strong>{word.word}</strong></p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
