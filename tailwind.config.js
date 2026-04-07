/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0F1117',
        card: '#1A1D2E',
        'accent-purple': '#6C63FF',
        'accent-cyan': '#00D4FF',
        gold: '#FFD700',
        green: '#00E676',
        red: '#FF5252',
        'text-primary': '#E8E8F0',
        'text-secondary': '#8B8FA8'
      }
    }
  },
  plugins: []
}