import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bni: {
          50: "#FFF6EF",
          100: "#FFE9D9",
          200: "#FFD0B0",
          300: "#FFB07E",
          400: "#FF8C4A",
          500: "#F26F21",
          600: "#C8500F",
          700: "#A03E0A",
          800: "#7A3008",
          900: "#5A2406",
        },
        navy: {
          50: "#EEF3FA",
          100: "#DCE6F3",
          200: "#B8CDE5",
          300: "#84A8CF",
          400: "#4F7EB0",
          500: "#2E5E93",
          600: "#1D4877",
          700: "#153962",
          800: "#102C4C",
          900: "#0B2547",
        },
        wa: {
          DEFAULT: "#25D366",
          hover: "#1FC65B",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11, 37, 71, 0.06), 0 12px 32px rgba(242, 111, 33, 0.10)",
        "card-lg": "0 2px 4px rgba(11, 37, 71, 0.08), 0 20px 48px rgba(11, 37, 71, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
