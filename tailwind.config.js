/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#0586d3",
        secondary:"3EF863E"
      }
    },
    backgroundImage:{
      'login-bg-img':"url(./src/assets/images/login.jpg)",
      'regis-bg-img':"url(./src/assets/images/register.jpg)",   
    }
  },
  plugins: [],
}

