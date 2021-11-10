module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        dark: "#222831",
        primary: "#700DA8",
      },
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        lg: "1140px",
        xl: "1140px",
        "2xl": "1320px",
      },
    },
    fontFamily: {
      sans: ["Rubik", "sans-serif"],
    },
    backgroundColor: () => ({
      primary: "#700DA8",
      primaryLight: "#FCF7FF",
      lightBorder: "#E5E5E5",
      secondary: "#fff",
      dark: "#202123",
      darkBorder: "#232323",
      mainDark: "#1B1C1E",
      transparent: "transparent",
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
