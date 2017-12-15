let config = {}

function methodMatch (req, endpoint) {
  return req.method.toLowerCase() === endpoint.method.toLowerCase()
}

function pathMatch (req, path) {
  const regex = new RegExp(path)
  return regex.test(req.path)
}

module.exports = {

  getConfig: function configServiceGet () {
    return config
  },

  matchFile: function configServiceMatchFile (req) {
    if (this.validConfig(config) && pathMatch(req, config.publicPath)) {
      let match
      config.files.forEach(file => {
        if (req.path === (file.path + '/' + file.name + '.' + file.extension)) {
          match = file
        }
      })
      return match
    }
  },

  matchEndpoint: function configServiceMatchEndpoint (req) {
    if (this.validConfig(config)) {
      let match
      config.endpoints.forEach(endpoint => {
        if (
          methodMatch(req, endpoint) &&
          pathMatch(req, endpoint.path)
        ) {
          match = endpoint
        }
      })
      return match
    }
  },

  storeConfig: function configServiceStore (c) {
    config = c
  },

  validConfig: function configServiceValid (c) {
    return c && c.name && c.port && c.endpoints && Array.isArray(c.endpoints)
  }

}
