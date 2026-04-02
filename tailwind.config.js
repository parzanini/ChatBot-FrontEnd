// Tailwind CSS configuration for the ChatBot Admin Dashboard
// Scans HTML and Vue/JS files to identify Tailwind classes for purging unused styles
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}, // Extend default theme colors and utilities here if needed
  },
  plugins: [], // Add Tailwind plugins here if needed
}
