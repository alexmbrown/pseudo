const configService = require('../services/config.service')
const loggingService = require('../services/log.service')
const path = require('path')
const moduleUtils = require('../utils/module.util')

const dependencies = {}
function updateDependencies (deps) {
  deps.forEach(dependency => {
    const version = moduleUtils.getVersion(dependency.module)
    if (
      !dependencies.hasOwnProperty(dependency) ||
      dependency[dependency.module].version !== version
    ) {
      dependencies[dependency.module] = {
        version,
        module: moduleUtils.getModule(dependency.module)
      }
    }
  })
  // TODO: remove unused dependencies
}

function generateBody (req, res, endpoint) {
  switch (endpoint.responseType) {
    case 'DYNAMIC':
      return generateBodyDynamic(req, res, endpoint.body)
    case 'JSON':
      return endpoint.body
  }
}

function generateBodyDynamic (req, res, body) {
  const modules = Object.values(dependencies).map(dependency => dependency.module)
  // eslint-disable-next-line no-new-func
  const method = new Function('req', 'res', ...Object.keys(dependencies), body)
  return method(req, res, ...modules)
}

module.exports = function matchingMiddleware (req, res, next) {
  updateDependencies([{
    module: 'lodash',
    version: '4.17.4'
  }])
  const endpointMatch = configService.matchEndpoint(req)
  const fileMatch = configService.matchFile(req)
  if (endpointMatch) {
    req.matched = true
    const body = generateBody(req, res, endpointMatch)
    res.status(endpointMatch.status).send(body)
    loggingService.emitEntry(req, res, body)
  } else if (fileMatch) {
    res.sendFile(path.join(process.env.FILE_LOCATION, fileMatch.id + '.' + fileMatch.extension))
  } else {
    next()
  }
}
