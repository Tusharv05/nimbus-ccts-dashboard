/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          900: "#1A1A1A",
          800: "#2B2B2B",
          700: "#3D3D3D",
          600: "#555555",
          500: "#737373",
          100: "#F5F5F3",
          50: "#FAFAF8",
        },
        accent: {
          DEFAULT: "#8B261E", // deep brick red / editorial tone
          hover: "#731F18",
          light: "#FDF5F4",
          border: "#F3D5D2",
        },
        surplus: {
          DEFAULT: "#1E5F3B",
          light: "#F0F8F3",
        }
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["Consolas", "Monaco", "Courier New", "monospace"],
      }
    },
  },
  plugins: [],
}