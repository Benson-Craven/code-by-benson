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
            keyframes: {
                slide: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(calc(-100% - 1rem))" },
                },
                slider: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-100%)" },
                },
            },
            animation: {
                slide: "slide 10s linear infinite",
                slider: "slider 12s linear infinite",
                rotate: "rotate 17.5s linear infinite",
            },
            fontFamily: {
                helvetica: ["Helvetica Neue", "sans-serif"],
                satoshi: ["Satoshi", "sans-serif"],
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
            })
        },
    ],
}
export default config
