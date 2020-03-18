module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '^/(api|uploaded)': {
        target: 'http://0.0.0.0:3000'
      },
    }
  },
  outputDir: '../back-end/dist/resources/static',
  indexPath: 'index.hbs'
}