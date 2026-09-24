/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#ffe4f0',
          200: '#fec8f5',
          300: '#f472b6',
          400: '#ec4899',
          500: '#e845a8',
          600: '#d94693',
          700: '#c026d3',
          800: '#a21caf',
          900: '#86198f',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          600: '#475569',
          700: '#1e293b',
          800: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}