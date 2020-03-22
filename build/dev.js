const fs = require('fs')
const path = require('path')
const { rootPath } = require('./utils')
const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const app = express()
const pageTarget = (process.env.page || '').split(',')
console.log(pageTarget)

// webpack编译
const compiler = webpack(webpackConfig)
const middleware = webpackMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath
})
app.use(middleware)
app.use(webpackHotMiddleware(compiler))

// 静态资源请求
app.use(express.static(rootPath('static')))
// Mock接口请求
app.get('/api/*', function (req, res) {
  let result = ''
  try {
    result = fs.readFileSync(
      rootPath(`api/${req.params[0]}.json'`)
    )
  } catch (err) {
    result = JSON.stringify({
      code: 404,
      msg: err.toString()
    })
  }
  res.write(result)
  res.end()
})

// 多页页面
app.get('/:page', function (req, res) {
  let result = ''
  try {
    result = middleware.fileSystem.readFileSync(
      path.join(webpackConfig.output.path + '/' + req.params.page + '.html')
    )
  } catch (err) {
    result = err.toString()
  }
  res.write(result)
  res.end()
})

const port = webpackConfig.devServer.port || '8080'
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
if (webpackConfig.devServer.open) {
  let pageUrl = pageTarget[0] ? '/' + pageTarget[0] : ''
  require('open')(`http://localhost:${port + pageUrl}`)
}