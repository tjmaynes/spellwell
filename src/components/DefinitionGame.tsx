import { useState, useEffect } from 'react';
import type { Word } from '../types';
import { getRandomWords } from '../data/words';

interface DefinitionGameProps {
  word: Word;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (correct: boolean, score: number) => void;
  onBack: () => void;
}

export default function DefinitionGame({ word, difficulty, onComplete, onBack }: DefinitionGameProps) {
  const [options, setOptions] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const otherWords = getRandomWords(difficulty, 3).filter(w => w.word !== word.word);
    const allOptions = [word, ...otherWords].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  }, [word, difficulty]);

  const handleSelect = (selectedWord: string) => {
    if (revealed) return;

    setSelectedWord(selectedWord);
    setRevealed(true);

    const correct = selectedWord === word.word;
    const score = correct ? 10 : 0;

    setTimeout(() => {
      onComplete(correct, score);
    }, 1500);
  };

  if (options.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h2>Definition Match</h2>
      </div>

      <div className="definition-card">
        <h3>What word matches this definition?</h3>
        <p className="definition-text">{word.definition}</p>
      </div>

      <div className="options-grid">
        {options.map((option) => {
          const isSelected = selectedWord === option.word;
          const isCorrect = option.word === word.word;

          let className = 'option-button';
          if (revealed) {
            if (isCorrect) {
              className += ' correct';
            } else if (isSelected && !isCorrect) {
              className += ' incorrect';
            }
          }

          return (
            <button
              key={option.word}
              className={className}
              onClick={() => handleSelect(option.word)}
              disabled={revealed}
            >
              {option.word}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className={`result-message ${selectedWord === word.word ? 'win' : 'lose'}`}>
          {selectedWord === word.word ? (
            <>
              <h3>Correct! 🎉</h3>
              <p>Great job!</p>
            </>
          ) : (
            <>
              <h3>Not quite!</h3>
              <p>The correct answer was: <strong>{word.word}</strong></p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
