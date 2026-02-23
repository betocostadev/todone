const nativewind = require('nativewind/preset')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [nativewind],
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FDF4D7',
        line: '#BDC3C7',
        margin: '#FF6B6B',
        primary: '#FF6B6B',
        textMain: '#2C3E50',
        textNote: '#636E72',
        tagBlue: '#3498DB',
        checkGreen: '#27AE60',
      },
      fontFamily: {
        handwriting: ['IndieFlower'],
        title: ['ShadowsIntoLight'],
      },
      spacing: {
        row: '44px', // 2.75rem
      },
    },
  },
  plugins: [],
}
