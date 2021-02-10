module.exports = {
    root: true,
    env: {
        node: true
    },
    parserOptions: {
        ecmaVersion: 2020,
        ecmaFeatures: {
            jsx: false
        }
    },
    extends: [
        "plugin:vue/vue3-strongly-recommended",
        "@vue/typescript",
        "eslint:recommended",
        "@vue/typescript/recommended",
        "@vue/prettier/@typescript-eslint"
    ],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "prefer-const": "error",
        "indent": ["error", 4],
        "comma-dangle": ["error", "never"],
        "no-unexpected-multiline": 0,
        "@typescript-eslint/no-inferrable-types": 0,
        "@typescript-eslint/explicit-function-return-type": ["error"],
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: "memberLike",
                modifiers: ["private"],
                format: ["camelCase"],
                leadingUnderscore: "require"
            }
        ],
        "@typescript-eslint/typedef": [
            "error",
            {
                arrayDestructuring: true,
                arrowParameter: true,
                memberVariableDeclaration: true,
                objectDestructuring: true,
                parameter: true,
                propertyDeclaration: true,
                variableDeclaration: true,
                variableDeclarationIgnoreFunction: true
            }
        ],
        "@typescript-eslint/consistent-type-assertions": [
            "error",
            {
                assertionStyle: "as"
            }
        ],
        "vue/max-attributes-per-line": "off",
        "vue/html-indent": [
            "error",
            4,
            {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: []
            }
        ],
        "vue/html-self-closing": [
            "error",
            {
                html: {
                    void: "always",
                    normal: "always",
                    component: "always"
                },
                svg: "always",
                math: "always"
            }
        ],
        "vue/singleline-html-element-content-newline": [
            "error",
            {
                ignoreWhenNoAttributes: false,
                ignoreWhenEmpty: false,
                ignores: []
            }
        ]
    }
};
