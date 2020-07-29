module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: '4001'
  },
  publicPath: process.env.VUE_APP_MODE === 'page' ? '/tool-work/' : '/',
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
