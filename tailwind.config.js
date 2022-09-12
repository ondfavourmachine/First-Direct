/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  theme: {
    extend: {},
    colors: {
      'fbn-blue': '#002855',
      'ffbn-gold': '#D69B01',
      'ffbn-gold-light': '#f7bd1e',
      'fbn-gray-bg': '#F5F5F5',
      'fbn-text': '#535353',
      'white': '#fff',
      'red': '#dc2626'
    }
  },
  plugins: [],
}
