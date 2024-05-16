/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-grey': '#161d28'
      },
      backgroundImage: {
        'register-bg': 'url(./assets/register-bg.jpg)',
      }
    },
    container: {
      center: true,
    },
  },
  plugins: [],
}