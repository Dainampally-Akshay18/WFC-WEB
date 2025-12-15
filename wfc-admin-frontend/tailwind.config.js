// wfc-admin-frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // This is the critical change to enable your class-based theme switching
  darkMode: 'class', 
  
  content: [
    // Ensure all your file paths are included here so Tailwind can scan them
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}