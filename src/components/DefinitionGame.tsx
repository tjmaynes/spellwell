import { useState, useEffect } from 'react';
import type { Word } from '../types';
import { getRandomWordsExcluding } from '../data/words';
import HistoryPanel from './HistoryPanel';

interface DefinitionGameProps {
  word: Word;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (correct: boolean, score: number) => void;
  onBack: () => void;
  correctHistory: Word[];
}

export default function DefinitionGame({ word, difficulty, onComplete, onBack, correctHistory }: DefinitionGameProps) {
  const [options, setOptions] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const wordsToExclude = [...correctHistory, word];
    const otherWords = getRandomWordsExcluding(difficulty, 3, wordsToExclude);
    const allOptions = [word, ...otherWords].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setSelectedWord(null);
    setRevealed(false);
  }, [word, difficulty, correctHistory]);

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

      <HistoryPanel correctHistory={correctHistory} />
    </div>
  );
}
