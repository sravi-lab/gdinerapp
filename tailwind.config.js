/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.js",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007367',
          50: '#f0fdfc',
          100: '#ccfbf7',
          200: '#99f6ed',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#007367',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        secondary: {
          DEFAULT: '#f3e5cb',
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f3e5cb',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      // Optionally extend fonts, spacing, etc.
    },
  },
  plugins: [], // Optional but good for variants
}
