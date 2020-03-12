module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '^/(api|uploaded)': {
        target: 'http://0.0.0.0:3000'
      },
    }
  }
}