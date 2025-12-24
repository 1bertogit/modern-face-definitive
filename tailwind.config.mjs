/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Editorial Luxury Palette
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1e293b', // Deep Petrol - Primary Brand Color
          950: '#102a43',
        },
        accent: {
          50: '#fbf9f5',
          100: '#f6f2eb',
          200: '#eaddc6',
          300: '#dec7a2',
          400: '#d2b17d',
          500: '#c69c59',
          600: '#b8956c', // Gold/Bronze - Primary Accent
          700: '#9d7f5c',
          800: '#82694d',
          900: '#67533d',
          950: '#4c3d2d',
        },
        ivory: '#fafaf8', // Editorial Background
        warmGray: '#4a4a48', // Body Text
        softGray: '#8a8a88', // Secondary Text
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#4a4a48', // warmGray
            h1: {
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: '400',
              color: '#1e293b', // primary-900
            },
            h2: {
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: '400',
              color: '#1e293b',
              marginTop: '2.5rem',
              marginBottom: '1rem',
            },
            h3: {
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: '400',
              color: '#1e293b',
            },
            h4: {
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: '400',
              color: '#1e293b',
            },
            strong: {
              color: '#1e293b',
              fontWeight: '700',
            },
            a: {
              color: '#9d7f5c', // accent-700 - better contrast
              textDecoration: 'none',
              '&:hover': {
                color: '#82694d', // accent-800
              },
            },
            blockquote: {
              borderLeftColor: '#9d7f5c', // accent-700
              fontStyle: 'italic',
              color: '#1e293b',
            },
            'ul > li::marker': {
              color: '#9d7f5c', // accent-700
            },
            'ol > li::marker': {
              color: '#9d7f5c', // accent-700
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
