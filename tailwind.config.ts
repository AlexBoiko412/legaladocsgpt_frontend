import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0052cc',
          dark: '#0041a3',
        },
        secondary: {
          DEFAULT: '#f8f9fa',
          dark: '#e9ecef',
        },
        accent: {
          DEFAULT: '#ffc107',
          dark: '#e0a800',
        },
        text: {
          DEFAULT: '#212529',
          light: '#6c757d',
        },
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;