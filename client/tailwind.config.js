/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F1117',
        surface: '#1A1D27',
        card: '#21253A',
        border: '#2E3349',
        slate: {
          700: '#374151',
          800: '#1F2937',
        },
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
