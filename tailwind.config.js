/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#030014",
        secondary: "#151312",
        light: {
          100: '#D6C6FF',
          200: '#A8B5DB',
          300: '#9CA4AB',
          400: '#4C63FF',
          500: '#3E17FF',
          600: '#3313CC',
          700: '#280F99',
          800: '#1D0B66',
        },
        dark: {
          100: '#221f3d',
          200: '#0f0d23',
          300: '#280F99',
          400: '#3313CC',
          500: '#3E17FF',
        },
        accent: "#AB8BFF"
      }
    },
  },
  plugins: [],
}