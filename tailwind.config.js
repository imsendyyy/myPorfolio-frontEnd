/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: {
          600: '#4f46e5', // Replace with your desired color
          700: '#4338ca',
          300: '#a5b4fc',
        },
      },
      perspective: {
        '1500': '1500px',
        '3000': '3000px',
      },
      boxShadow: {
        custom: 'rgba(0, 0, 0, 0.25) 0px 25px 50px -12px',
        inner: 'inset 0 8px 8px 0 rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.transform-3d': {
          transform: 'perspective(1500px) rotateY(15deg)',
          transition: 'transform 1s ease',
        },
        '.transform-3d-hover:hover': {
          transform: 'perspective(3000px) rotateY(5deg)',
        },
      });
    },
  ],
}

