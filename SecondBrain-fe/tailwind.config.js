/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {
      colors :{
        purple : {
          600 : "#5046e4",
          300 : "#e0e7fe",
          500 : "#3e38a7"
        }
      }
    },
  },
  plugins: [],
}

