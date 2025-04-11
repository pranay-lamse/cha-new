import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        golden: "#B89F5C",
        "golden-bold": "#DAC172",
        "golden-light": "#DCC373",
        "golden-sand": "#C9B671",
        "blue-translucent": "rgba(15, 51, 95, 0.6)",
        "deep-navy": "#0F335F",
        "twilight-navy": "#324862"
      },
      backgroundImage: {
        "horse-icon": "url('/assets/img/horsehair.png')",
        "title-gradient": "linear-gradient(90deg,#c37f00,rgba(255,192,0,0))",
      },
      backgroundSize: {
        "4": "1rem",
      },
      zIndex: {
        "99": "99",
      },
      minHeight: {
        "400": "25rem",
        "700": "44rem",
      },
      borderRadius: {
        "1/2": "50%"
      },
      fontSize: {
      'xxs': ['0.5625rem', '1rem']
      }
    },
  },
  plugins: [],
} satisfies Config;
