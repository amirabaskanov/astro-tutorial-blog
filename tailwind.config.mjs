/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '14': 'repeat(14, minmax(0, 1fr))',
      },
      animation: {
        'fade-up': 'fade-in-bottom 0.85s cubic-bezier(0.33, 1, 0.68, 1) forwards',
        'fade-up-200': 'fade-in-bottom 0.85s cubic-bezier(0.33, 1, 0.68, 1) 200ms forwards',
        'fade-up-400': 'fade-in-bottom 0.85s cubic-bezier(0.33, 1, 0.68, 1) 400ms forwards',
        'fade-up-600': 'fade-in-bottom 0.85s cubic-bezier(0.33, 1, 0.68, 1) 600ms forwards',
        'blur-out': 'blur-out 0.85s cubic-bezier(0.33, 1, 0.68, 1) forwards',
      },
      keyframes: {
        'fade-in-bottom': {
          '0%': {
            opacity: '0.025',
            transform: 'translateY(35px)',
          },
          '20%': {
            opacity: '0.2',
          },
          '40%': {
            opacity: '0.5',
            transform: 'translateY(20px)',
          },
          '70%': {
            opacity: '0.8',
            transform: 'translateY(8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'blur-out': {
          '0%': {
            filter: 'blur(8px)',
          },
          '20%': {
            filter: 'blur(6px)',
          },
          '40%': {
            filter: 'blur(4px)',
          },
          '70%': {
            filter: 'blur(2px)',
          },
          '100%': {
            filter: 'blur(0)',
          },
        },
      },
      animationDelay: {
        '200': '200ms',
        '400': '400ms',
        '600': '600ms',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 