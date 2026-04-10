/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(16px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 250ms ease-out both",
        "fade-up": "fade-up 400ms ease-out both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 10s ease-in-out infinite",
        "pulse-slow": "pulse 6s ease-in-out infinite",
        "pulse-slower": "pulse 10s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
