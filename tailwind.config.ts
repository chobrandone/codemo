import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand tokens (match the reference site)
        primary: { DEFAULT: "#1F5B36", foreground: "#FFFFFF" },
        ink: "#132A25",
        deep: "#183F27",
        body: "#202820",
        muted: { DEFAULT: "#F7F3E9", foreground: "#667066" },
        gold: "#D6A738",
        leaf: "#6E9F3C",
        earth: "#795734",
        cream: "#F7F3E9",
        mist: "#F1F5EF",
        border: "#DCE5DE",
        input: "#D3DDD6",
        ring: "#D6A738",
        background: "#FFFFFF",
        foreground: "#202820",
        destructive: { DEFAULT: "#C02626", foreground: "#FFFFFF" },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Iowan Old Style", "Georgia", "serif"],
        body: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        rise: { from: { transform: "translateY(18px)" }, to: { transform: "none" } },
      },
      animation: {
        "fade-in": "fade-in .3s ease-out",
        // Hero copy: pure CSS so it plays on first paint, before hydration.
        rise: "rise .9s cubic-bezier(0.22,1,0.36,1) both",
        "rise-late": "rise .9s .25s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [typography],
};

export default config;
