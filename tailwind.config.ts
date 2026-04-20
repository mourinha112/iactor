import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0B",
        surface: "#111113",
        elevated: "#16161A",
        border: "#1F1F23",
        muted: "#6B6B73",
        text: "#EDEDEF",
        accent: "#E8FF59"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        tightest: "-0.04em"
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px"
      },
      boxShadow: {
        soft: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.3)"
      }
    }
  },
  plugins: []
};
export default config;
