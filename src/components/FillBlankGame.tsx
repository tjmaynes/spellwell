import { useState, useEffect } from 'react';
import type { Word } from '../types';
import { getRandomWords } from '../data/words';

interface FillBlankGameProps {
  word: Word;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (correct: boolean, score: number) => void;
  onBack: () => void;
}

export default function FillBlankGame({ word, difficulty, onComplete, onBack }: FillBlankGameProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const otherWords = getRandomWords(difficulty, 3)
      .filter(w => w.word !== word.word)
      .map(w => w.word);
    const allOptions = [word.word, ...otherWords].sort(() => Math.random() - 0.5);
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

  const renderSentence = () => {
    if (!word.exampleSentence) {
      return <p className="sentence">No example sentence available.</p>;
    }

    const parts = word.exampleSentence.split('_');

    return (
      <p className="sentence">
        {parts[0]}
        <span className={`blank ${revealed ? (selectedWord === word.word ? 'correct' : 'incorrect') : ''}`}>
          {selectedWord || '______'}
        </span>
        {parts[1]}
      </p>
    );
  };

  if (options.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h2>Fill in the Blank</h2>
      </div>

      <div className="fillblank-card">
        <h3>Complete the sentence:</h3>
        <div className="sentence-container">
          {renderSentence()}
        </div>
      </div>

      <div className="definition-hint">
        <strong>Hint:</strong> {word.definition}
      </div>

      <div className="options-grid">
        {options.map((option) => {
          const isSelected = selectedWord === option;
          const isCorrect = option === word.word;

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
              key={option}
              className={className}
              onClick={() => handleSelect(option)}
              disabled={revealed}
            >
              {option}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className={`result-message ${selectedWord === word.word ? 'win' : 'lose'}`}>
          {selectedWord === word.word ? (
            <>
              <h3>Perfect! 🎉</h3>
              <p>You completed the sentence correctly!</p>
            </>
          ) : (
            <>
              <h3>Not quite!</h3>
              <p>The correct word was: <strong>{word.word}</strong></p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
