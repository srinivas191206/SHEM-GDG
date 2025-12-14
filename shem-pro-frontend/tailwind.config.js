/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4B5563', // gray-600
          DEFAULT: '#111827', // gray-900 (keeping this as "primary" for now to avoid breaking existing pages too much)
          dark: '#0e121d',
        },
        accent: {
          DEFAULT: '#f7b529', // Gold
          hover: '#d99f24',
        },
        dashboard: {
          bg: '#1a1d29', // Main background
          card: '#252836', // Card background
          text: '#ffffff',
          textSecondary: '#8a8d9c',
          success: '#22c55e',
          danger: '#ef4444',
        },
        neutralBg: {
          light: '#f9f9f9',
          lighter: '#f5f5f5',
          dark: '#1a1a1a',
        },
        gradient: {
          purple: { from: '#667eea', to: '#764ba2' },
          pink: { from: '#f093fb', to: '#f5576c' },
          blue: { from: '#e3f2fd', to: '#bbdefb' },
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
