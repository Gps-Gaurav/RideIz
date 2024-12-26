/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        animation: {
          'fade-in-up': 'fadeInUp 0.5s ease-out',
            shimmer: 'shimmer 1.5s infinite',
            pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        },
        variants: {
          extend: {
      cursor: ['disabled'],
            transitionProperty: {
              'height': 'height',
              'spacing': 'margin, padding',
          },
              backgroundColor: ['hover', 'active'],
              opacity: ['disabled'],
              scale: ['group-hover'],
            transform: ['group-hover'],
            borderColor: ['active', 'group-focus'],
            ring: ['group-focus'],
          },
      },
        keyframes: {
          wiggle: {
            '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' },
          },
          fadeInUp: {
            '0%': {
              opacity: '0',
              transform: 'translateY(20px)',
            },
            '100%': {
              opacity: '1',
              transform: 'translateY(0)',
            },
          },
            shimmer: {
                '100%': {
                    transform: 'translateX(100%)',
                },
            }
        }
    }
},
  plugins: [],
}

