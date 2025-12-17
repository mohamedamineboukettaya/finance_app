/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',    // Blue (trustworthy)
        secondary: '#1e293b',
        accent: '#f59e0b',       // Accent color (highlights, badges)
        success: '#10b981',      // Success messages
        danger: '#ef4444',       // Error messages
        warning: '#f59e0b',      // Warnings
        info: '#3b82f6',
      }
    },
  },
  plugins: [
    function({ addVariant }) {
    addVariant('dark', '&:where(.dark, .dark *)');
  }
  ],
}