process.on('uncaughtException', error => {
  console.error('uncaught exception', error)
  process.send({
    successful: false,
    error: error.message,
    stackTrace: error.stack
  })
})

const express = require('express')
const middleware = require('./middleware')
const routes = require('./routes')
const server = require('./services/server-admin.service')

server.init()
server.attachMiddleware(middleware.matching)

// admin routes
const router = express.Router()
router.get('/health-check', routes.admin.healthCheck)
router.get('/config', routes.admin.config)
server.attachMiddleware('/__pseudo__/', router)

// request not matched
const loggingService = require('./services/log.service')
server.attachMiddleware((req, res) => {
  if (!req.matched) {
    res.sendStatus(404);
    loggingService.emitEntry(req, res)
  }
})

server.start()
