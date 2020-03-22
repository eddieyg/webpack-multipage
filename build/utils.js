const path = require('path')

module.exports = {
  rootPath: p => path.join(__dirname, '../', p || '')
}