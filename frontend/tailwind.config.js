/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#080415',
          navy: '#0d0822',
          card: '#140d33',
          cardBorder: '#291b5c',
          accent: '#8b5cf6',
          accentGlow: '#a855f7',
          surface: '#1b1242',
          subtle: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(168, 85, 247, 0.25)',
        'glow-lg': '0 0 50px -10px rgba(168, 85, 247, 0.35)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.45)',
      }
    },
  },
  plugins: [],
}
