/* eslint-disable */
const colors = require("tailwindcss/colors");

module.exports = {
    darkMode: "class",
    future: {
        // removeDeprecatedGapUtilities: true,
        // purgeLayersByDefault: true,
    },
    theme: {
        extend: {
            colors: {
                ...colors,
                "company-primary": "var(--color-company-primary)",
                "company-secondary": "var(--color-company-secondary)"
            },
            backgroundColor: {
                header: "var(--color-bg-header)",
                primary: "var(--color-bg-primary)",
                secondary: "var(--color-bg-secondary)",
                tertiary: "var(--color-bg-tertiary)"
            },
            textColor: {
                accent: "var(--color-text-accent)",
                header: "var(--color-text-header)",
                primary: "var(--color-text-primary)",
                secondary: "var(--color-text-secondary)"
            },
            borderColor: (theme) => theme("backgroundColor"),
            gradientColorStops: (theme) => theme("backgroundColor"),
            width: {
                30: "7.5rem",
                34: "8.5rem",
                100: "25rem",
                130: "32.5rem",
                140: "35rem"
            },
            height: {
                30: "7.5rem",
                34: "8.5rem",
                100: "25rem",
                130: "32.5rem",
                140: "35rem"
            },
            boxShadow: {
                "b-full": "0px calc(100vh - 2px) 0px 100vh #f5f5f5",
                "r-full": "calc(100vh - 2px) 0px 0px 100vh #f5f5f5"
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
