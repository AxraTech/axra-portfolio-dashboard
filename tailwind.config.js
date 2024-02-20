/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondaryColor: "#F5F4F7",
        sidebarColor: "#FFFFFF",
        white_color: "#FFFFFF",
        bgColor: "#BFB0D1",
        text_color: "#7F58AF",
        client1Bgcolor: "#F3E4FF",
        client2Color: "#FF04C5",
        client2BgColor: "#FFE5F9",
        client3Color: "#046AFD",
        client3BgColor: "#EEF5FF",
      },
      width: {
        day_width: "81.2px",
        table_width: "438px",
        width: "800px",
      },
      height: {
        day_height: "47px",
      },
    },
  },
  plugins: [],
};
