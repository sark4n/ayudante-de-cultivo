/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // Incluye todos los archivos en app/, incluyendo styles/
  ],
  theme: {
    extend: {
      colors: {
        green: {
          300: '#9ae6b4',
          500: '#48bb78',
          600: '#38a169',
          700: '#2d6a4f',
        },
        gray: {
          800: '#2d3748',
          900: '#1a202c',
        },
        red: {
          500: '#e53e3e',
          600: '#c53030',
          700: '#9b2c2c',
        },
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      maxWidth: {
        'md': '28rem', // Asegura max-w-md (448px)
        'lg': '32rem', // Asegura max-w-lg (512px)
      },
    },
  },
  plugins: [],
};