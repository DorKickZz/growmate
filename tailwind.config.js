/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-white",
    "bg-gray-50",
    "text-gray-800",
    "font-sans",
    "rounded-xl",
    "shadow",
    "shadow-md",
    "hover:shadow-lg",
    "p-4",
    "p-6",
    "p-8",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
