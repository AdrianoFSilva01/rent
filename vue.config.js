/* eslint-disable */
const tsNameOf = require("ts-nameof");

module.exports = {
    chainWebpack: (config) => {
        config.module
            .rule("ts")
            .test(/\.ts$/)
            .use("ts-loader")
            .loader("ts-loader")
            .options({
                transpileOnly: true,
                getCustomTransformers: () => ({ before: [tsNameOf] }),
                appendTsSuffixTo: [/\.vue$/],
                happyPackMode: true
            })
            .end()
            .use("ts-nameof")
            .loader("ts-nameof-loader")
            .end()
            .use("eslint")
            .loader("eslint-loader")
            .options({
                extensions: [".ts", ".tsx", ".vue"],
                cache: true,
                emitWarning: true,
                emitError: true,
                formatter: undefined
            });
    }
};
