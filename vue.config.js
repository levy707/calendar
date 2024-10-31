module.exports = {
    lintOnSave: false,
    css: {
        loaderOptions: {
            scss: {
                additionalData: '@import "@/assets/style/variables.scss";',
            },
        },
    },
};
