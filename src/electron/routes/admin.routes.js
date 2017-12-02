const configService = require('../services/config.service');

module.exports = {

  config: function adminConfig(req, res) {
    res.send(configService.getConfig())
  },

  healthCheck: function adminHealthCheck(req, res) {
    res.sendStatus(200)
  }

}
