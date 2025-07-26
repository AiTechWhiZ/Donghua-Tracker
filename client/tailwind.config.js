/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8", // Blue
        secondary: "#9333EA", // Purple
        accent: "#F59E0B", // Amber
        success: "#10B981", // Green
        warning: "#FBBF24", // Yellow
        danger: "#EF4444", // Red
        muted: "#6B7280", // Gray
        background: "#F3F4F6", // Light gray
        dark: "#111827", // Dark background
      },
    },
  },
  plugins: [],
};

