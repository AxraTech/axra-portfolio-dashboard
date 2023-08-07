/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondaryColor: "#F5F4F7",
        sidebarColor: "#FFFFFF",
        white_color: "#FFFFFF",
        sidebar_text_color: "#BFB0D1",
        sidebar_hover_color: "#7F58AF",
      },
    },
  },
  plugins: [],
};
