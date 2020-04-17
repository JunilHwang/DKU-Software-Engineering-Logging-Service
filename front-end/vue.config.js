const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const fs = require('fs')
const path = require('path')
const isSSR = process.env.NODE_ENV === 'ssr'
const isDev = process.env.NODE_ENV === 'development'

console.log(`build-ssr-entry:  src/main${isSSR ? '-ssr' : '' }.ts`)

module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '^/(api|uploaded)': {
        target: 'http://0.0.0.0:3000'
      },
    }
  },
  outputDir: '../resources',
  assetsDir: 'static',
  indexPath: 'templates/dist/index.hbs',
  pages: {
    index: {
      entry: `src/main${isSSR ? '-ssr' : '' }.ts`,
      template: `${isDev ? 'public' : '../resources/templates' }/index.html`
    }
  },

  chainWebpack: config => {
    if (isSSR) {
      config.target('node')
      config.optimization.delete('splitChunks')
      config.output.libraryTarget('commonjs2')
      config.plugin('ssr').use(VueSSRServerPlugin).end()
    } else {
      const highlight = require('highlight.js');
      const highlightDefineVue = require('highlightjs-vue');
      highlightDefineVue(highlight);
      highlight.initHighlightingOnLoad();
    }
  }
}