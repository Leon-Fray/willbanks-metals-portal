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
        steel: {
          DEFAULT: "#1a1f2e",
          mid: "#2c3347",
          light: "#3d4560",
        },
        rust: {
          DEFAULT: "#2f7fbc",
          bright: "#4499d8",
        },
        amber: {
          metal: "#d4922a",
        },
        ice: {
          DEFAULT: "#e8eef5",
          dim: "#c9d3de",
        },
        wm: {
          text: "#eef1f5",
          "text-dim": "#8a95a8",
          green: "#2db87d",
          "green-dim": "#1a7a52",
          blue: "#3b82c4",
          yellow: "#f0b429",
        },
      },
      fontFamily: {
        head: ["var(--font-barlow-condensed)", "sans-serif"],
        body: ["var(--font-barlow)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-texture":
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-40": "40px 40px",
      },
    },
  },
  plugins: [],
};
export default config;
