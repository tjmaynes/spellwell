import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 bg-white/10 dark:bg-white/10 border-2 border-white/20 dark:border-white/20 rounded-full text-2xl transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:-rotate-12 backdrop-blur-sm"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
