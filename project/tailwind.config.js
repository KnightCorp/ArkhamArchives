/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
      },
      colors: {
        batcomputer: {
          primary: '#000000',
          secondary: '#1a1a1a',
          accent: '#00a2ff',
          background: '#000000',
          glass: 'rgba(0, 0, 0, 0.85)',
          'glass-border': 'rgba(0, 162, 255, 0.15)',
          hologram: 'rgba(0, 162, 255, 0.1)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 1s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'hologram-scan': 'hologramScan 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', filter: 'brightness(0)' },
          '100%': { opacity: '1', filter: 'brightness(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(60px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%': { opacity: '0.5' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.5' },
        },
        hologramScan: {
          '0%': { transform: 'translateX(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(100%) rotate(45deg)' },
        },
      },
    },
  },
  plugins: [],
};