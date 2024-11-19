import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['ReplicaLL'],
        mono: ['ReplicaLLMono'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... 其他色阶
          500: '#0284c7',
        }
      },
      animation: {
        'bounce-delayed': 'bounce 1s infinite 0.2s',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
};
export default config;
