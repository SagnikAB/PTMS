/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tokyo Palette (#283845 and #FFA649 from design palette)
        tokyo: {
          navy: '#283845',
          amber: '#FFA649',
          cream: '#FAF6F0'
        },
        navy: {
          50: '#f1f5f8',
          100: '#e0e8ef',
          200: '#c1d2df',
          300: '#97b4c8',
          400: '#5b85a3',
          500: '#3d607a',
          600: '#2f4a5e',
          700: '#283845', // Exact #283845 from palette
          DEFAULT: '#283845',
          800: '#1f2c37',
          900: '#18222b',
          950: '#0e151b'
        },
        amber: {
          50: '#fffaf4',
          100: '#fff2e3',
          200: '#ffe2c2',
          300: '#ffce97',
          400: '#ffb76b',
          500: '#FFA649', // Exact #FFA649 from palette
          DEFAULT: '#FFA649',
          600: '#f08b26',
          700: '#c86a14',
          800: '#9e4f12',
          900: '#7d3e11'
        },
        // Mapped existing token aliases to the new Tokyo palette
        sienna: {
          50: '#fffaf4',
          100: '#fff2e3',
          200: '#ffe2c2',
          300: '#ffce97',
          400: '#ffb76b',
          500: '#FFA649', // Tokyo Amber
          DEFAULT: '#FFA649',
          600: '#f08b26',
          700: '#c86a14',
          800: '#9e4f12',
          900: '#283845'
        },
        ivory: {
          50: '#FAF7F2',
          100: '#F5EFE6',
          200: '#E9DECf',
          DEFAULT: '#E9DECf',
          300: '#D9C9B4',
          400: '#C4B199',
          500: '#A9947B'
        },
        stormy: {
          50: '#f1f5f8',
          100: '#e0e8ef',
          200: '#c1d2df',
          300: '#97b4c8',
          400: '#5b85a3',
          500: '#3d607a',
          600: '#2f4a5e',
          700: '#283845', // Tokyo Navy
          DEFAULT: '#283845',
          800: '#1f2c37',
          900: '#18222b'
        },
        sage: {
          50: '#f2f7f6',
          100: '#deecaa',
          200: '#bedcd6',
          300: '#92c3bb',
          400: '#64a59c',
          500: '#468b82',
          DEFAULT: '#468b82',
          600: '#346f68',
          700: '#2c5853',
          800: '#264844',
          900: '#223c39'
        },
        primary: {
          50: '#f1f5f8',
          100: '#e0e8ef',
          200: '#c1d2df',
          300: '#97b4c8',
          400: '#5b85a3',
          500: '#283845',
          DEFAULT: '#283845',
          600: '#1f2c37',
          700: '#18222b',
          800: '#0e151b',
          900: '#080d11',
          amber: '#FFA649'
        }
      },
      fontFamily: {
        chorus: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Syne"', '"Plus Jakarta Sans"', 'sans-serif'],
        tokyo: ['"Syne"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
