import type { Word } from '../types';

export const vocabulary: Word[] = [
  // Easy words
  {
    word: 'happy',
    definition: 'Feeling or showing pleasure or contentment',
    difficulty: 'easy',
    exampleSentence: 'She felt very _ after receiving the good news.'
  },
  {
    word: 'brave',
    definition: 'Ready to face and endure danger or pain',
    difficulty: 'easy',
    exampleSentence: 'The _ firefighter rescued the cat from the tree.'
  },
  {
    word: 'quick',
    definition: 'Moving fast or doing something in a short time',
    difficulty: 'easy',
    exampleSentence: 'He took a _ glance at his watch.'
  },
  {
    word: 'smart',
    definition: 'Having or showing intelligence',
    difficulty: 'easy',
    exampleSentence: 'She made a _ decision to save money.'
  },
  {
    word: 'friend',
    definition: 'A person with whom one has a bond of mutual affection',
    difficulty: 'easy',
    exampleSentence: 'My best _ and I have known each other for years.'
  },
  {
    word: 'bright',
    definition: 'Giving out or reflecting much light',
    difficulty: 'easy',
    exampleSentence: 'The _ sun shone through the window.'
  },
  {
    word: 'clean',
    definition: 'Free from dirt, marks, or stains',
    difficulty: 'easy',
    exampleSentence: 'Please keep your room _ and tidy.'
  },
  {
    word: 'strong',
    definition: 'Having the power to move heavy things or overcome resistance',
    difficulty: 'easy',
    exampleSentence: 'He is _ enough to lift that heavy box.'
  },

  // Medium words
  {
    word: 'abundant',
    definition: 'Existing or available in large quantities',
    difficulty: 'medium',
    exampleSentence: 'The garden had an _ supply of fresh vegetables.'
  },
  {
    word: 'candid',
    definition: 'Truthful and straightforward; frank',
    difficulty: 'medium',
    exampleSentence: 'She gave a _ response about her concerns.'
  },
  {
    word: 'diligent',
    definition: 'Having or showing care in one\'s work or duties',
    difficulty: 'medium',
    exampleSentence: 'The _ student studied for hours every day.'
  },
  {
    word: 'eloquent',
    definition: 'Fluent or persuasive in speaking or writing',
    difficulty: 'medium',
    exampleSentence: 'The speaker delivered an _ presentation.'
  },
  {
    word: 'frugal',
    definition: 'Sparing or economical with regard to money or food',
    difficulty: 'medium',
    exampleSentence: 'She is very _ and always looks for the best deals.'
  },
  {
    word: 'genuine',
    definition: 'Truly what something is said to be; authentic',
    difficulty: 'medium',
    exampleSentence: 'His smile was warm and _.'
  },
  {
    word: 'humble',
    definition: 'Having or showing a modest estimate of one\'s importance',
    difficulty: 'medium',
    exampleSentence: 'Despite her success, she remained _.'
  },
  {
    word: 'innovative',
    definition: 'Featuring new methods; advanced and original',
    difficulty: 'medium',
    exampleSentence: 'The company is known for its _ approach to technology.'
  },

  // Hard words
  {
    word: 'ephemeral',
    definition: 'Lasting for a very short time',
    difficulty: 'hard',
    exampleSentence: 'The beauty of cherry blossoms is _ but breathtaking.'
  },
  {
    word: 'quintessential',
    definition: 'Representing the most perfect or typical example',
    difficulty: 'hard',
    exampleSentence: 'She is the _ professional, always punctual and prepared.'
  },
  {
    word: 'ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    difficulty: 'hard',
    exampleSentence: 'Smartphones have become _ in modern society.'
  },
  {
    word: 'meticulous',
    definition: 'Showing great attention to detail; very careful',
    difficulty: 'hard',
    exampleSentence: 'The artist was _ in her attention to every brushstroke.'
  },
  {
    word: 'benevolent',
    definition: 'Well-meaning and kindly',
    difficulty: 'hard',
    exampleSentence: 'The _ organization helps families in need.'
  },
  {
    word: 'pragmatic',
    definition: 'Dealing with things sensibly and realistically',
    difficulty: 'hard',
    exampleSentence: 'We need a _ approach to solve this complex problem.'
  },
  {
    word: 'ambiguous',
    definition: 'Open to more than one interpretation; unclear',
    difficulty: 'hard',
    exampleSentence: 'The _ instructions confused many people.'
  },
  {
    word: 'tenacious',
    definition: 'Persistent and determined',
    difficulty: 'hard',
    exampleSentence: 'Her _ spirit helped her overcome many obstacles.'
  }
];

export function getRandomWord(difficulty: 'easy' | 'medium' | 'hard'): Word {
  const filtered = vocabulary.filter(w => w.difficulty === difficulty);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getRandomWordExcluding(difficulty: 'easy' | 'medium' | 'hard', excludeWords: Word[]): Word | null {
  const excludedWordStrings = excludeWords.map(w => w.word.toLowerCase());
  const filtered = vocabulary.filter(
    w => w.difficulty === difficulty && !excludedWordStrings.includes(w.word.toLowerCase())
  );

  if (filtered.length === 0) {
    return null;
  }

  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getRandomWords(difficulty: 'easy' | 'medium' | 'hard', count: number): Word[] {
  const filtered = vocabulary.filter(w => w.difficulty === difficulty);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getRandomWordsExcluding(difficulty: 'easy' | 'medium' | 'hard', count: number, excludeWords: Word[]): Word[] {
  const excludedWordStrings = excludeWords.map(w => w.word.toLowerCase());
  const filtered = vocabulary.filter(
    w => w.difficulty === difficulty && !excludedWordStrings.includes(w.word.toLowerCase())
  );
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
