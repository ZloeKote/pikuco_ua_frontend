/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "dark-main-background": "url('/public/dark-main-background.png')",
      },
    },
  },
  plugins: [],
};
