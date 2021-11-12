/* eslint-disable */
const colors = require("tailwindcss/colors");

const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default;

module.exports = {
    theme: {
        extend: {
            colors: {
                ...colors,
                gold: "#d6a159"
            },
            height: {
                136: "34rem",
                172: "43rem",
                180: "45rem"
            },
            width: {
                84: "21rem",
                112: "28rem",
                124: "31rem",
                136: "34rem",
                140: "35rem"
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
    purge: ["./public/**/*.html", "./src/**/*.{vue,ts}"],
    variants: {
        extend: {
            borderWidth: ['first', 'last', 'hover'],
            opacity: ['first'],
            margin: ['last'],
            width: ['focus']
        }
    },
    plugins: [
        ({ addUtilities, e, theme, variants }) => {
            let colors = flattenColorPalette(theme('borderColor'));
            delete colors['default'];

            // Replace or Add custom colors
            if(this.theme?.extend?.colors !== undefined){
                colors = Object.assign(colors, this.theme.extend.colors);
            }

            const colorMap = Object.keys(colors)
                .map(color => ({
                    [`.border-t-${color}`]: {borderTopColor: colors[color]},
                    [`.border-r-${color}`]: {borderRightColor: colors[color]},
                    [`.border-b-${color}`]: {borderBottomColor: colors[color]},
                    [`.border-l-${color}`]: {borderLeftColor: colors[color]},
                }));
            const utilities = Object.assign({}, ...colorMap);

            addUtilities(utilities, variants('borderColor'));
        },
    ],
};
