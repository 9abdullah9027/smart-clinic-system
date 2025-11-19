/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Admin Pro Grey Theme Palette
        primary: {
          light: '#4B5563', // Gray 600
          DEFAULT: '#1F2937', // Gray 800 (Sidebar/Dark BG)
          dark: '#111827',    // Gray 900
        },
        secondary: {
          DEFAULT: '#3B82F6', // Blue 500 (Accents)
          hover: '#2563EB',   // Blue 600
        },
        background: {
          DEFAULT: '#F3F4F6', // Light Gray Main BG
          dark: '#1F2937',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}