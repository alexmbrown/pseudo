const server = require('./server-admin.service')

function mapRequest(req) {
  return {
    path: req.path,
    headers: req.header,
    cookies: req.cookies,
    query: req.query,
    method: req.method,
    body: req.body
  }
}

function mapResponse(res, resBody) {
  return  {
    body: resBody,
    status: res.statusCode,
  }
}

module.exports = {

  emitEntry: function logServiceAddRequestEntry (req, res, resBody) {
    if (req.path.indexOf('__pseudo__') < 0) {
      server.emit('log', {
        timestamp: new Date(),
        req: mapRequest(req),
        res: mapResponse(res, resBody)
      })
    }
  },

  clear: function logServiceClear () {
    entries = []
  }

}
