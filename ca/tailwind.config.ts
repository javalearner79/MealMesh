import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))", background: "hsl(var(--background))", foreground: "hsl(var(--foreground))", primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" }, muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" }, card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" }, emerald: { DEFAULT: "hsl(var(--emerald))" } }, borderRadius: { xl: "1rem", "2xl": "1.25rem" }, boxShadow: { soft: "0 8px 32px rgb(15 23 42 / 0.06)" } } },
  plugins: []
};
export default config;
