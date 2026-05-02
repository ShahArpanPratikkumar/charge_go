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
        dark: "#06090F",
        primary: "#00D2FF",
        secondary: "#00F5A0",
        accent: "#FF00FF",
        surface: "rgba(255, 255, 255, 0.05)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to bottom, rgba(6, 9, 15, 0) 0%, rgba(6, 9, 15, 1) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
