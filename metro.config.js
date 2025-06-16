const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname, {
  projectRoot: __dirname,
  watchFolders: ['./src'], // Add the `src` folder to the watch list
})

// Proxy config only for development web version
if (process.env.NODE_ENV === 'development') {
  config.server = {
    ...config.server,
    proxy: {
      '/api': {
        target: 'http://194.233.67.229:3000',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  }
}

module.exports = withNativeWind(config, { input: './global.css' })
