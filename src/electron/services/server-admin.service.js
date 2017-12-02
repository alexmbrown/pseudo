const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const configService = require('./config.service')

const app = express()
const http = require('http').Server(app);

let server;
const io = require('socket.io')(http);

module.exports = {

  init: function serverAdminServiceInit() {
    app.use(cors())
    app.use(bodyParser.json())
    app.use(cookieParser())

    // heart-beat socket
    setInterval(() => {
      io.emit('heart-beat')
    }, 5000)

    io.on('connection', socket => {
      socket.on('config update', config => {
        configService.storeConfig(config)
      });

      socket.on('server stop', () => {
        server.close();
        process.exit();
      });
    });
  },

  attachMiddleware: function serverAdminServiceAttachMiddleware (arg1, arg2) {
    if (typeof arg1 === 'function') {
      app.use(arg1)
    } else if (typeof arg1 === 'string' && typeof arg2 === 'function') {
      app.use(arg1, arg2)
    }
  },

  start: function serverAdminServiceStart () {
    const port = process.env.PORT
    try {
      server = http.listen(port, () => {
        process.send({
          successful: true
        })
      })
    } catch (error) {
      console.error('Error starting mock server', error)
      process.send({
        successful: false,
        error: error.message,
        stackTrace: error.stack
      });
    }
  },

  emit: function serverAdminServiceEmit (event, value) {
    io.emit(event, value)
  }

}
