/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xs: "13px",
      },
    },
    colors: {
      "l-orange": "#FBE899",
      "d-orange": "#D27322",
      white: "#FFF",
      gray: "#808080",
      black: "#000",
      red: "#FF0000",

      // New colors bt Moiz-Color
      "primary-orange":"#C06F39",
      "secondary-orange":"#D27322",
      "light-orange":"#C06F39",
      "screen-light":"#FFFDF7",

      green: "#008000",


      // app specific colors
      formSubGray: "#707072",
      formGray: "#B7B7B7",
      formDarkGray: "#111",
      formButtonGray: "#CCCCCC",
      neutralGray: "#f5f5f5",
    },
    content: {
      ticketLogo: 'url("../src/assets/ticket-top.png")',
      arrowUpIcon: 'url("../src/arrow-up-icon.svg")',
    },
  },
  plugins: [],
};
