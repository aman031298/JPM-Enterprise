/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "#f4f6fb",
        ink: "#101828",
        accent: {
          DEFAULT: "#2a5bd7",
          50: "#eef2fe",
          100: "#dde6fd",
          200: "#b8caf9",
          300: "#8ea9f3",
          400: "#5d80ea",
          500: "#2a5bd7",
          600: "#2147ad",
          700: "#1b3888",
          800: "#172d6b",
          900: "#142556"
        },
        coral: "#e0603f",
        sand: "#e2e6ef",
        mist: "#f8f9fc",
        panel: "#ffffff",
        line: "#dde1ea",
        surface: {
          DEFAULT: "#f4f6fb",
          dark: "#0b0f19"
        },
        panelDark: "#12161f"
      },
      boxShadow: {
        panel: "0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 24px -8px rgba(16, 24, 40, 0.08)",
        "panel-lg": "0 4px 8px rgba(16, 24, 40, 0.04), 0 24px 48px -12px rgba(16, 24, 40, 0.14)"
      },
      fontFamily: {
        heading: ["'Inter'", "-apple-system", "system-ui", "'Segoe UI'", "sans-serif"],
        body: ["'Inter'", "-apple-system", "system-ui", "'Segoe UI'", "sans-serif"]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
