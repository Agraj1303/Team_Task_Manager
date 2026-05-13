/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // Indigo
        secondary: '#06b6d4', // Cyan
        dark: '#1e293b', // Slate 800
        darker: '#0f172a', // Slate 900
        light: '#f8fafc',
      }
    },
  },
  plugins: [],
}
