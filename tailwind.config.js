/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        washi: { DEFAULT: '#F5F0E1', light: '#FCF9EF', paper: '#FFFDF7' },
        sumi: { DEFAULT: '#1C1A16', light: '#3D3933' },
        muted: { DEFAULT: '#7A7268', light: '#A89F92' },
        kon: { DEFAULT: '#2D4A6B', deep: '#1F3450' },
        shu: '#A8423A',
        moegi: '#6B7F4A',
        hairline: { DEFAULT: '#D9D0BC', light: '#E8DFCB' },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
        mincho: ['"Shippori Mincho"', '"Noto Serif JP"', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
