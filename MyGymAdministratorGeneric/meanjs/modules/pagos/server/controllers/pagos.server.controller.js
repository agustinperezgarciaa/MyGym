'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Pago = mongoose.model('Pago'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Pago
 */
exports.create = function (req, res) {
  var pago = new Pago(req.body);
  pago.user = req.user;

  pago.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pago);
    }
  });
};

/**
 * Show the current Pago
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var pago = req.pago ? req.pago.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  pago.isCurrentUserOwner = req.user && pago.user && pago.user._id.toString() === req.user._id.toString();

  res.jsonp(pago);
};

/**
 * Update a Pago
 */
exports.update = function (req, res) {
  var pago = req.pago;

  pago = _.extend(pago, req.body);

  pago.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pago);
    }
  });
};

/**
 * Delete an Pago
 */
exports.delete = function (req, res) {
  var pago = req.pago;

  pago.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pago);
    }
  });
};

/**
 * List of Pagos
 */
exports.list = function (req, res) {
  Pago.find().sort('-created').populate('user', 'displayName').exec(function (err, pagos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pagos);
    }
  });
};

/**
 * Pago middleware
 */
exports.pagoByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Pago is invalid'
    });
  }

  Pago.findById(id).populate('user', 'displayName').exec(function (err, pago) {
    if (err) {
      return next(err);
    } else if (!pago) {
      return res.status(404).send({
        message: 'No Pago with that identifier has been found'
      });
    }
    req.pago = pago;
    next();
  });
};
