const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{html,svelte,ts,js}'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=corporate]'],

          'base-200': colors.slate[100],

          '--rounded-box': '0.5rem',
          '--rounded-badge': '0.75rem',
          '--rounded-btn': '0.5rem'
        }
      }
    ]
  }
}
