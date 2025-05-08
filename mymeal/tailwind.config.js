/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D5DEDA",
          100: "#D5DEDA"




        },
        secondary: {
          DEFAULT: "#1A5745",
          100: "#1A5745",
          200: "#FDFFFD",
          300: "#D5DEDA"


        },
        black: {
          DEFAULT: "#000",
          100: "#000000",
          200: "#787676",
          300: "#AFADAD"
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
        karegular: ["Kavoon-Regular", "sans-serif"],
        kregular: ["K2D-Regular", "sans-serif"],
        kbold: ["K2D-Bold", "sans-serif"],
        jregular: ["Julee-regular", "sans-serif"],
        ibold: ["Inter_18pt-Bold", "sans-serif"]
      },
    },
  },
  plugins: [],
};
