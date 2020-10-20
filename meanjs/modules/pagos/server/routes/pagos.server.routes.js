'use strict';

/**
 * Module dependencies
 */
var pagosPolicy = require('../policies/pagos.server.policy'),
  pagos = require('../controllers/pagos.server.controller');

module.exports = function (app) {
  // Pagos Routes
  app.route('/api/pagos').all(pagosPolicy.isAllowed)
    .get(pagos.list)
    .post(pagos.create);

  app.route('/api/pagos/:pagoId').all(pagosPolicy.isAllowed)
    .get(pagos.read)
    .put(pagos.update)
    .delete(pagos.delete);

  // Finish by binding the Pago middleware
  app.param('pagoId', pagos.pagoByID);
};
