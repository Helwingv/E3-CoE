module.exports = {
  content: ["./src/**/*.{astro,html,md,mdx,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        unity: {
          blue: "#5B9BD5"
        },
        growth: {
          green: "#3BA66B"
        },
        community: {
          orange: "#F29F32"
        },
        people: {
          red: "#D45432"
        },
        deep: {
          navy: "#0F2A45"
        },
        soft: {
          cream: "#FBF7F1"
        },
        warm: {
          gold: "#E1B85A"
        },
        cool: {
          teal: "#5B9BD5"
        },
        charcoal: "#263238",
        e3: {
          50: "#EEF5FB",
          100: "#DCEAF6",
          200: "#B9D5ED",
          300: "#8FBCE2",
          DEFAULT: "#5B9BD5",
          500: "#5B9BD5",
          600: "#3D7FC1",
          700: "#2F6496",
          800: "#16385C",
          900: "#0F2A45"
        },
        brand: {
          DEFAULT: "#5B9BD5",
          accent: "#F29F32",
          secondary: "#3BA66B"
        }
      }
    }
  },
  plugins: []
};
