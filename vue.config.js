module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/assets/style/variables.scss";`,
      },
    },
  },
};
