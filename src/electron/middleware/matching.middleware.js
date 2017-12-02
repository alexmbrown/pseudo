const configService = require('../services/config.service')
const loggingService = require('../services/log.service')
const path = require('path')
const faker = require('faker')
const _ = require('lodash')

function generateBody(req, res, endpoint) {
  switch (endpoint.responseType) {
    case 'DYNAMIC':
      return generateBodyDynamic(req, res, endpoint.body);
    case 'JSON':
      return endpoint.body
  }
}

function generateBodyDynamic(req, res, body) {
  const method = Function("req", "res", "faker", "_", body);
  return method(req, res, faker, _);
}

module.exports = function matchingMiddleware (req, res, next) {
  const endpointMatch = configService.matchEndpoint(req);
  const fileMatch = configService.matchFile(req);
  if (endpointMatch) {
    req.matched = true;
    const body = generateBody(req, res, endpointMatch);
    res.status(endpointMatch.status).send(body)
    loggingService.emitEntry(req, res, body)
  } else if (fileMatch) {
    res.sendFile(path.join(process.env.FILE_LOCATION, fileMatch.id + '.' + fileMatch.extension))
  } else {
    next()
  }
}
