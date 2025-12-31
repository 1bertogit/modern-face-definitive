/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Editorial Luxury · Medical Authority - Canonical Colors
        primary: {
          50: '#e8ebf0',
          100: '#c5d0de',
          200: '#9fb3c8',
          300: '#7896b2',
          400: '#51799c',
          500: '#2a5c86',
          600: '#1f4a6f',
          700: '#153858',
          800: '#0f2641',
          900: '#0A192F', // Navy - Primary Brand Color (Protagonist)
          950: '#050d1a',
        },
        accent: {
          50: '#f5f1e8',
          100: '#e8dcc4',
          200: '#dbc7a0',
          300: '#ceb27c',
          400: '#c19d58',
          500: '#C5A059', // Gold - Primary Accent (Punctual)
          600: '#9d8047',
          700: '#756035',
          800: '#4d4023',
          900: '#252011',
          950: '#121008',
        },
        neutral: {
          white: '#FFFFFF', // Dominant Background
          greySoft: '#F5F5F5', // Soft Grey
          graphite: '#2A2A2A', // Technical Grid / Lines
        },
        // Legacy aliases for backward compatibility
        ivory: '#FFFFFF', // Now maps to white
        warmGray: '#2A2A2A', // Now maps to graphite
        softGray: '#F5F5F5', // Now maps to greySoft
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#2A2A2A', // graphite (neutral.graphite)
            h1: {
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: '400',
              color: '#0A192F', // primary-900 (Navy)
            },
            h2: {
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: '400',
              color: '#0A192F', // primary-900 (Navy)
              marginTop: '2.5rem',
              marginBottom: '1rem',
            },
            h3: {
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: '400',
              color: '#0A192F', // primary-900 (Navy)
            },
            h4: {
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: '400',
              color: '#0A192F', // primary-900 (Navy)
            },
            strong: {
              color: '#0A192F', // primary-900 (Navy)
              fontWeight: '500', // Reduced from 700 (prohibited heavy bolding)
            },
            a: {
              color: '#C5A059', // accent-500 (Gold)
              textDecoration: 'none',
              '&:hover': {
                color: '#9d8047', // accent-600 (darker gold)
              },
            },
            blockquote: {
              borderLeftColor: '#C5A059', // accent-500 (Gold)
              fontStyle: 'italic',
              color: '#0A192F', // primary-900 (Navy)
            },
            'ul > li::marker': {
              color: '#C5A059', // accent-500 (Gold)
            },
            'ol > li::marker': {
              color: '#C5A059', // accent-500 (Gold)
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
