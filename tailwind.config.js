/* eslint-disable */
const colors = require("tailwindcss/colors");

module.exports = {
    theme: {
        extend: {
            colors: {
                ...colors,
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
