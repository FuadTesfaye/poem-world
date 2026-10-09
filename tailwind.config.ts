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
        paper: "#ecd9ab",
        ink: "#34190a",
        ember: "#a8481a",
        gilt: "#9a6b1f",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "serif"],
        fell: ['"IM Fell English"', "Georgia", "serif"],
        sc: ['"IM Fell English SC"', "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
