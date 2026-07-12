import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F7F5F2",
        ink: "#1F1B2E",
        primary: "#4B3F72",
        accent: "#E84D8A",
        success: "#B8E3D1",
        card: "#E8DFF5",
        muted: "#6B5F8A",
        "muted-light": "#9B8EC4",
        "input-bg": "#EDE8F7",
        "success-text": "#3BAA80",
        "footer-text": "#C4BAD8",
      },
      borderRadius: {
        card: "20px",
        button: "12px",
        badge: "8px",
      },
      boxShadow: {
        card: "0px 8px 24px rgba(75, 63, 114, 0.08), 0px 2px 8px rgba(75, 63, 114, 0.04)",
        "card-hover":
          "0px 12px 32px rgba(75, 63, 114, 0.13), 0px 3px 10px rgba(75, 63, 114, 0.07)",
        "accent-button": "0px 4px 16px rgba(232, 77, 138, 0.28)",
        "accent-button-hover": "0px 6px 22px rgba(232, 77, 138, 0.38)",
        "framework-doc":
          "0px 16px 48px rgba(31, 27, 46, 0.22), 0px 4px 16px rgba(31, 27, 46, 0.12)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        label: ["var(--font-space-grotesk)", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;