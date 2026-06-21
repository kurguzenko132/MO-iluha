import type { Config } from 'tailwindcss'
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080A12',
        accent: {
          pink: '#FF77A8',
          violet: '#8B5CF6',
          blue: '#38BDF8',
          danger: '#EF4444',
          warning: '#FACC15',
          success: '#22C55E'
        }
      }
    }
  },
  plugins: []
} satisfies Config
