module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: '4001'
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#2D90FF'
        },
        javascriptEnabled: true
      }
    }
  }
}
