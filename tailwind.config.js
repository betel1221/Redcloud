/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF', // Pitch black
        surface: '#F9FAFB', // Darkest gray for cards
        surfaceHover: '#FEE2E2',
        primary: '#FFFFFF', // Pure white accent
        success: '#34D399', // Muted green
        warning: '#FBBF24', // Muted amber
        danger: '#FECACA', // Muted red
        textPrimary: '#FFFFFF',
        textSecondary: '#A3A3A3',
        border: '#FECACA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
