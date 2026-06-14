import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#07070f",
          surface: "#0f0f1a",
          card: "#161622",
          elevated: "#1e1e2e",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          subtle: "rgba(255,255,255,0.04)",
          strong: "rgba(255,255,255,0.14)",
        },
        primary: {
          DEFAULT: "#7c3aed",
          hover: "#6d28d9",
          light: "#a78bfa",
          glow: "rgba(124,58,237,0.25)",
        },
        accent: {
          cyan: "#06b6d4",
          amber: "#f59e0b",
          rose: "#f43f5e",
          green: "#10b981",
        },
        text: {
          primary: "#f0f0fa",
          secondary: "#9090b8",
          muted: "#505070",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Syne", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
        "gradient-card": "linear-gradient(145deg, rgba(22,22,34,0.8) 0%, rgba(15,15,26,1) 100%)",
        "glass": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "shimmer": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
      },
      boxShadow: {
        "glow-primary": "0 0 30px rgba(124,58,237,0.2)",
        "glow-cyan": "0 0 30px rgba(6,182,212,0.2)",
        "glow-sm": "0 0 12px rgba(124,58,237,0.15)",
        "card": "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.6)",
        "nav": "0 -1px 0 rgba(255,255,255,0.06), 0 -8px 32px rgba(0,0,0,0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "fade-up": "fadeUp 0.3s ease-out",
        "slide-in-right": "slideInRight 0.25s ease-out",
        "slide-in-bottom": "slideInBottom 0.25s ease-out",
        "scale-in": "scaleIn 0.15s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "shimmer": "shimmer 1.5s infinite",
        "float": "float 3s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        slideInBottom: {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          from: { transform: "scale(0.92)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(124,58,237,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(124,58,237,0.4)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
