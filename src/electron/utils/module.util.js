const fs = require('fs-extra')
const path = require('path')

module.exports = {

  getModule: function moduleUtilsGetVersion (module) {
    return require(path.join(process.env.FILE_LOCATION, 'node_modules', module))
  },

  getVersion: function moduleUtilsGetVersion (module) {
    return fs.readJsonSync(path.join(process.env.FILE_LOCATION, 'node_modules', module, 'package.json')).version
  }

}
