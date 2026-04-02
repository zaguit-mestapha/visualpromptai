import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F0F1A",
        foreground: "#E8E8F0",
        primary: "#6C3CE1",
        accent: "#00C9A7",
        "surface": "#1A1A2E",
        "surface-light": "#252542",
        "muted": "#8888A0",
      },
    },
  },
  plugins: [],
};
export default config;
