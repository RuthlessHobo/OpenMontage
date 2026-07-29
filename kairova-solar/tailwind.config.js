/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#090B0D',
        graphite: '#11171B',
        ivory: '#F3F0E8',
        amber: '#F5C84C',
        lime: '#C9F75A',
        sky: '#74BDE8',
        mist: '#98A1A6'
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'serif'],
        body: ['"Instrument Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
}
