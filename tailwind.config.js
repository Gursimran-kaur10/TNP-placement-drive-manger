/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { blue: "#1689d4", navy: "#172653", pale: "#eaf4fc" },
      },
    },
  },
  plugins: [],
}
