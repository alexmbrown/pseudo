const fork = require('child_process').fork
const fileUtils = require('./utils/file.util')

module.exports = (serverId, port, cb) => {
  try {
    const child = fork('./src/electron/mock-server.js', [], {
      env: {
        PORT: port,
        FILE_LOCATION: fileUtils.getPath(serverId)
      }
    })

    child.on('message', function (msg) {
      if (msg.successful) {
        cb(null, true)
      } else {
        cb(msg.error, false)
      }
    })
  } catch (err) {
    console.log('ERROR CAUGHT')
    cb(err, false)
  }
}
