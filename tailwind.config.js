const colors = require('tailwindcss/colors')

module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,css}'],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
      './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
    ],
    theme: {
      extend: {
        colors: {
          zinc: {
            950: '#09090b', // Add missing color shade
          },
          slate: {
            950: '#020617' // Ensure this exists (default in Tailwind)
          }
        },
        animation: {
          'fade-in-bottom': 'fade-in-bottom 0.45s cubic-bezier(0.39, 0.575, 0.565, 1) forwards'
        },
        keyframes: {
          'fade-in-bottom': {
            '0%': { opacity: '0.025', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' }
          }
        }
      }
    },
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          '.drop-shadow-green': {
            'filter': 'drop-shadow(0px 0px 8px #59ff7e)'
          }
        })
      }
    ]
  }