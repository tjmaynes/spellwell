import { useStore } from '@nanostores/react'
import { $theme, toggleTheme } from '~/stores/themeStore'

export default function ThemeToggle() {
  const theme = useStore($theme)

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 border-2 rounded-full text-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12 backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--card-bg)'
      }}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
