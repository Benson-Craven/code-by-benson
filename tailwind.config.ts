import type { Config } from "tailwindcss"
import { PluginAPI } from "tailwindcss/types/config"

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                paper: "rgb(var(--paper-rgb) / <alpha-value>)",
                "paper-alt": "rgb(var(--paper-alt-rgb) / <alpha-value>)",
                ink: "rgb(var(--ink-rgb) / <alpha-value>)",
                signal: "rgb(var(--signal-rgb) / <alpha-value>)",
                "signal-dark": "rgb(var(--signal-dark-rgb) / <alpha-value>)",
                muted: "rgb(var(--muted-rgb) / <alpha-value>)",
                // The redesign preview keeps its own fixed palette.
                preview: {
                    blue: "#3a5de3",
                    white: "#fbfbf8",
                    black: "#0b0b0c",
                },
            },
            keyframes: {
                slide: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(calc(-100% - 1rem))" },
                },
                slider: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-100%)" },
                },
                flagWave: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "25%": { transform: "translateY(-2px)" },
                    "75%": { transform: "translateY(2px)" },
                },
                fireflyFlicker: {
                    "0%, 18%, 28%, 65%, 76%, 100%": { opacity: "1" },
                    "14%, 23%": { opacity: "0.6" },
                    "52%, 71%": { opacity: "0.8" },
                },
                caseHeroIn: {
                    from: { opacity: "0", transform: "translateY(14px)" },
                    to: { opacity: "1", transform: "none" },
                },
            },
            animation: {
                slide: "slide 10s linear infinite",
                slider: "slider 12s linear infinite",
                rotate: "rotate 17.5s linear infinite",
                "flag-wave": "flagWave 2.6s ease-in-out infinite",
                "firefly-flicker": "fireflyFlicker 2.7s steps(1, end) infinite",
                "case-hero-in":
                    "caseHeroIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
            },
            fontFamily: {
                helvetica: ["Helvetica Neue", "sans-serif"],
                satoshi: ["Satoshi", "sans-serif"],
                funnel: ['"Funnel Sans Preview"', "sans-serif"],
            },
            translate: {
                "1/3": "-33.33%",
            },
            perspective: {
                "80vw": "80vw",
            },
        },
    },
    plugins: [
        function ({ addUtilities }: PluginAPI) {
            addUtilities({
                ".perspective-80vw": {
                    perspective: "80vw",
                },
                // The reference draws one faint 80px grid behind whole sections.
                ".grid-paper": {
                    backgroundImage:
                        "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                },
                ".grid-paper-columns": {
                    backgroundImage:
                        "linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                },
            })
        },
    ],
}
export default config
