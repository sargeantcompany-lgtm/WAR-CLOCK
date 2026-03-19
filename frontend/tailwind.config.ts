import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090b0f",
        steel: "#111723",
        fog: "#bfc7d5",
        ember: "#dd5a43",
        signal: "#f0c36a",
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        serif: ["'Source Serif 4'", "serif"],
      },
      boxShadow: {
        panel: "0 20px 60px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "news-grid":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
    },
  },
  plugins: [],
} satisfies Config;
