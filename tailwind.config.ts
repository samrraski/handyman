import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#F5C800",
          "yellow-hover": "#DDB200",
          "yellow-light": "#FFF8D6",
          black: "#0F0F0F",
          "gray-900": "#1A1A1A",
          "gray-800": "#2A2A2A",
          "gray-600": "#555555",
          "gray-400": "#999999",
          "gray-200": "#E5E5E5",
          "gray-100": "#F5F5F5",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
