/* eslint-disable */
const colors = require("tailwindcss/colors");

module.exports = {
    theme: {
        extend: {
            colors: {
                ...colors,
            },
            height: {
                180: "45rem"
            },
            transitionDuration: {
                400: "400ms",
                2000 : "2000ms",
                "main": "var(--transition-duration-main)"
            },
            animation: {
                "wave-button-animation": " wave-button-animation .4s forwards",
                "wave-button-animation-reverse": "wave-button-animation-reverse .4s",
            },
            keyframes: {
                "wave-button-animation": {
                    "0%": {
                        transform: "translateY(0%)"
                    },
                    "50%": {
                        transform: "translateY(-100%)"
                    },
                    "51%": {
                        transform: "translateY(100%)"
                    },
                    "100%": {
                        transform: "translateY(0%)"
                    }
                },
                "wave-button-animation-reverse": {
                    "0%": {
                        transform: "translateY(0%)"
                    },
                    "50%": {
                        transform: "translateY(100%)"
                    },
                    "51%": {
                        transform: "translateY(-100%)"
                    },
                    "100%": {
                        transform: "translateY(0%)"
                    }
                }
            }
        },
        fontFamily: {
            sans: ["Segoe UI"]
        }
    },
    purge: ["./public/**/*.html", "./src/**/*.vue"],
    variants: {},
    plugins: []
};
