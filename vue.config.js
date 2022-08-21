module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        publish: ['github'],
        win: {
          icon: './public/favicon.ico'
        },
      }
    }
  }
}