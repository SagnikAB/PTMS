/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sienna: {
          50: '#fbf5f2',
          100: '#f7e8e1',
          200: '#f0d3c5',
          300: '#e4b39e',
          400: '#cb7751',
          500: '#984216', // Burnt Sienna from image.png
          DEFAULT: '#984216',
          600: '#873812',
          700: '#6e2d0d',
          800: '#5a250c',
          900: '#481e0a'
        },
        ivory: {
          50: '#FAF8F5',
          100: '#F5EFE8',
          200: '#E4D6C5', // Ivory Sand from image.png
          DEFAULT: '#E4D6C5',
          300: '#D5C2AD',
          400: '#BFA890',
          500: '#A88E75'
        },
        stormy: {
          50: '#f2f5f6',
          100: '#e3e8eb',
          200: '#c8d2d6',
          300: '#a7b7bc',
          400: '#899da3',
          500: '#78898F', // Stormy Sky from image.png
          DEFAULT: '#78898F',
          600: '#5f7076',
          700: '#4c5a5f',
          800: '#3d484c',
          900: '#2b3336'
        },
        sage: {
          50: '#f4f6f2',
          100: '#e7ebe3',
          200: '#d1dac9',
          300: '#b5c2a9',
          400: '#9baa8e',
          500: '#8D957E', // Sage Green from image.png
          DEFAULT: '#8D957E',
          600: '#6f7861',
          700: '#565d4b',
          800: '#43483b',
          900: '#2e3228'
        },
        primary: {
          50: '#fbf5f2',
          100: '#f7e8e1',
          200: '#f0d3c5',
          300: '#e4b39e',
          400: '#cb7751',
          500: '#984216',
          600: '#873812',
          700: '#6e2d0d',
          800: '#5a250c',
          900: '#481e0a'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
