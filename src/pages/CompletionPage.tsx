import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import type { GameMode, Difficulty } from '../types';

export default function CompletionPage() {
  const navigate = useNavigate();
  const { mode, difficulty } = useParams<{ mode: GameMode; difficulty: Difficulty }>();
  const { score, correctHistory, resetGame } = useGame();

  const handleBackToMenu = () => {
    resetGame();
    navigate('/');
  };

  const handleTryAgain = () => {
    resetGame();
    if (mode && difficulty) {
      navigate(`/game/${mode}/${difficulty}`);
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'spelling':
        return 'Word Spelling';
      case 'definition':
        return 'Definition Match';
      case 'fillblank':
        return 'Fill in the Blank';
      case 'anagram':
        return 'Anagram Solver';
      default:
        return 'Game';
    }
  };

  const getDifficultyLabel = () => {
    return difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : '';
  };

  return (
    <div>
      <div className="max-w-[1000px] mx-auto">
        <div className="max-w-[600px] mx-auto mb-12 text-center p-12 bg-white/5 border-2 border-primary/30 rounded-3xl">
          <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            🎉 Congratulations! 🎉
          </h2>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            You've completed all <strong>{getDifficultyLabel()}</strong> words in{' '}
            <strong>{getModeTitle()}</strong>!
          </p>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-6">
              <div className="text-5xl font-extrabold text-primary mb-2">{correctHistory.length}</div>
              <div className="text-gray-400 text-sm">Words Mastered</div>
            </div>
            <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-6">
              <div className="text-5xl font-extrabold text-primary mb-2">{score}</div>
              <div className="text-gray-400 text-sm">Total Score</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              className="px-8 py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(102,126,234,0.4)]"
              onClick={handleTryAgain}
            >
              🔄 Try Again
            </button>
            <button
              className="px-8 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white font-semibold transition-all duration-200 hover:bg-white/15 hover:-translate-y-0.5"
              onClick={handleBackToMenu}
            >
              🏠 Back to Menu
            </button>
          </div>
        </div>

        {correctHistory.length > 0 && (
          <div className="bg-white/5 border-2 border-white/10 rounded-3xl p-8">
            <h3 className="text-center text-3xl font-bold mb-8 text-gray-400">Words You Mastered</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {correctHistory.map((word, index) => (
                <div
                  key={index}
                  className="bg-primary/10 border border-primary/20 rounded-xl p-5 transition-all duration-200 hover:bg-primary/15 hover:border-primary/30 hover:-translate-y-0.5"
                >
                  <div className="text-xl font-bold text-primary mb-3 capitalize">{word.word}</div>
                  <div className="text-gray-400 text-sm leading-relaxed">{word.definition}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
