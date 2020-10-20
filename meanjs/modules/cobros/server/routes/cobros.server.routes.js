'use strict';

/**
 * Module dependencies
 */
var cobrosPolicy = require('../policies/cobros.server.policy'),
  cobros = require('../controllers/cobros.server.controller');

module.exports = function (app) {
  // Cobros Routes
  app.route('/api/cobros').all(cobrosPolicy.isAllowed)
    .get(cobros.list)
    .post(cobros.create);

  app.route('/api/cobrodata').all(cobrosPolicy.isAllowed)
    .get(cobros.data)
    .post(cobros.create);

  app.route('/api/cobros/:cobroId').all(cobrosPolicy.isAllowed)
    .get(cobros.read)
    .put(cobros.update)
    .delete(cobros.delete);


  // Finish by binding the Cobro middleware
  app.param('cobroId', cobros.cobroByID);
};
