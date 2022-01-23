module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
        slide: "slide 225ms "
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)"
          },
          "33%": {
            transform: "translate(40px, -60px) scale(1.2)"
          },
          "66%": {
            transform: "translate(-30px, 30px) scale(0.8)"
          },"100%": {
            transform: "translate(0px, 0px) scale(1)"
          }
        },
        slide: {
          "0%": {
            transform: "translate(130px, 0px) scale(1)"
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)"
          }
        }
      }
    },
  },
  plugins: [require('daisyui'),],
  daisyui: {
    styled: true,
  }
}