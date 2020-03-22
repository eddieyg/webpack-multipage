const fs = require('fs')
const { rootPath } = require('./utils')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// 生成多页入口及HTML插件
const pageConf = {
  entry: {},
  htmlPlugin: [],
}
const pagePath = 'src/pages/'
fs.readdirSync(pagePath).forEach(p => {
  pageConf.entry[p] = rootPath(pagePath + p + '/index.js')
  pageConf.htmlPlugin.push(new HtmlWebpackPlugin({
    filename: p + '.html',
    template: 'src/template.html',
    inject: true,
    chunks: [p]
  }))
})

module.exports = {
  entry: pageConf.entry,
  output: {
    path: rootPath('dist'),
    filename: '[name].[chunkhash:8].js'
  },
  devtool: 'source-map',
  // 开发服务配置
  devServer: {
    // 监听端口
    port: 8088,
    inline: true,
    // 配置是否启用 gzip 压缩
    compress: true,
    // 自动打开默认浏览器
    open: true
  },
  plugins: [
    ...pageConf.htmlPlugin,
    new VueLoaderPlugin(),
    new CleanWebpackPlugin({
      dry: true,
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['dist/*']
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024
            }
          }
        ]
      }
    ]
  },
}