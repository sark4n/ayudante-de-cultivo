/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        secondary: 'var(--color-secondary)',
      },
      backgroundImage: {
        'gradient-novato': 'var(--gradient-novato)',
        'gradient-avanzado': 'var(--gradient-avanzado)',
        'gradient-experto': 'var(--gradient-experto)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
      },
    },
  },
  plugins: [],
};