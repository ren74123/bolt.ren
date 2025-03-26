/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F52E6B',
        accent: {
          DEFAULT: '#1C2340',
          gray: '#B4C2CD',
          purple: '#383949',
        },
      },
    },
  },
  plugins: [],
};
