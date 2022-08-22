/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-green": "#43E584",
        "transparent-dark": "#292C3378"
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
