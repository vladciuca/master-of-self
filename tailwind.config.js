const colors = require("./lib/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    "hover:bg-yellow-500/90",
    "hover:bg-purple-500/90",
    "disabled:bg-yellow-500/90",
    "disabled:bg-purple-500/90",
    "border-yellow-500/40",
    "border-purple-500/40",
    {
      pattern: new RegExp(
        `^(bg|text)-(${Object.values(colors.JOURNAL_COLORS).join("|")})$`
      ),
    },
    {
      //don't forget stroke- here!(in progress bar)
      pattern: new RegExp(
        `^(bg|text)-(${Object.values(colors.XP_COLORS).join("|")})$`
      ),
    },
    {
      pattern: new RegExp(
        `^(bg|text)-(${Object.values(colors.HABIT_COLORS).join("|")})$`
      ),
    },
    {
      pattern: new RegExp(`^(bg|text|border)-(${colors.ERROR_COLOR})(/\\d+)?$`),
      variants: ["hover"],
    },
    // {
    //   pattern:
    //     /^bg-\[linear-gradient$$to_right,_#[A-Fa-f0-9]{6}_50%,_#[A-Fa-f0-9]{6}_50%$$\]$/,
    // },
    {
      pattern: new RegExp(
        `^(bg|text)-(${Object.values(colors.HABIT_TIER_COLORS)
          .flatMap((tier) => [tier.background, tier.foreground])
          .join("|")})$`
      ),
    },
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
