module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '^/api': {
        target: 'http://0.0.0.0:3000'
      },
      '^/uploaded': {
        target: 'http://0.0.0.0:3000'
      },
    }
  }
}