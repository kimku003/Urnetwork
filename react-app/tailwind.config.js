/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        popIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pop-in': 'popIn 0.4s ease-out'
      },
      colors: {
        dark: {
          primary: '#1a1a1a',    // Fond principal
          secondary: '#2d2d2d',  // Fond secondaire
          accent: '#3b3b3b',     // Fond tertiaire
          text: {
            primary: '#ffffff',   // Texte principal
            secondary: '#a0aec0', // Texte secondaire
            muted: '#718096',    // Texte atténué
          },
          border: '#404040',
        }
      }
    }
  },
  plugins: []
}