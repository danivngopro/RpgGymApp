import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Barlow", "system-ui", "sans-serif"],
        display: ["Barlow Condensed", "Barlow", "sans-serif"]
      },
      colors: {
        arena: {
          bg: "#111827",
          panel: "#1F2937",
          panel2: "#263244",
          text: "#F8FAFC",
          muted: "#94A3B8",
          orange: "#F97316",
          amber: "#FB923C",
          green: "#22C55E",
          line: "#374151"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
