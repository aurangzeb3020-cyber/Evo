/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        evocative: {
          primary: "#0f766e",
          secondary: "#0d9488",
          accent: "#14b8a6",
          muted: "#99f6e4",
          dark: "#134e4a",
        },
      },
    },
  },
  plugins: [],
};
