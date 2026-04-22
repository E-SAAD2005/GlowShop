/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'atelier-bg': '#FAF7F4',
        'atelier-sidebar': '#F2EFED',
        'atelier-primary': '#8C1F45', // Bordeaux
        'atelier-primary-hover': '#721938',
        'atelier-primary-light': '#F2D4D7',
        'atelier-text': '#1C1414',
        'atelier-border': '#E8DDD5',
        'atelier-muted': '#8E8682',
        'atelier-success': '#E8F5E9',
        'atelier-success-text': '#2E7D32',
        'atelier-warning': '#FFF3E0',
        'atelier-warning-text': '#E65100',
        'atelier-danger': '#FFEBEE',
        'atelier-danger-text': '#C62828',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'atelier': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
