/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        nit: {
          primary: '#0f2b5b',
          'primary-light': '#1a3f7a',
          accent: '#3b82f6',
          'accent-light': '#60a5fa',
          gold: '#f59e0b',
          light: '#f0f4f8',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
