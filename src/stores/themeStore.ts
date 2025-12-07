import { atom } from 'nanostores'

type Theme = 'light' | 'dark'

// Initialize from localStorage if available (client-side only)
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('spellwell-theme')
    console.log(saved)
    return (saved as Theme) || 'dark'
  }
  return 'dark'
}

export const $theme = atom<Theme>(getInitialTheme())

export const toggleTheme = () => {
  const currentTheme = $theme.get()
  console.log("toggle", currentTheme)
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  $theme.set(newTheme)

  // Update localStorage and document attribute
  if (typeof window !== 'undefined') {
    localStorage.setItem('spellwell-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }
}

// Initialize document theme on load
if (typeof window !== 'undefined') {
  const theme = $theme.get()
  document.documentElement.setAttribute('data-theme', theme)

  console.log("init", theme)

  // Subscribe to theme changes
  $theme.subscribe((theme) => {
    console.log("change", theme)
    localStorage.setItem('spellwell-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  })
}
