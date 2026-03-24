/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f7ff',
          100: '#e0ecff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af'
        },
        success: '#22c55e',
        danger: '#ef4444'
      }
    }
  },
  plugins: []
}

