/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#F6F3EE', ink: '#141414',
        pastel: { sage:'#DCE8D6', peach:'#FBE1D0', sky:'#D8E8F4', butter:'#FBEEC3', blush:'#F8D9DF' },
        accent: { coral:'#E77F6E', green:'#6F9B64', sky:'#3986B5', amber:'#D2932E', pink:'#DF7188' }
      },
      fontFamily: { sans:['Inter','sans-serif'], display:['Plus Jakarta Sans','Inter','sans-serif'] },
      boxShadow: { panel:'0 18px 55px rgba(36,31,24,.08)' }
    }
  },
  plugins: []
};
