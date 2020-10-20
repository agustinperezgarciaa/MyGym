'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cobro = mongoose.model('Cobro'),
  User = mongoose.model('User'),
  moment = require('moment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Article = mongoose.model('Article'),
  _ = require('lodash');

/**
 * Create a Cobro
 */
exports.create = function (req, res) {
  // console.log(req.body)
  // return res.status(200).send({
  //   message: 'ok'
  // });
  const amount = req.body.disipline.price;
  const cobroId = req.body.disipline._id;
  const disciplineTitle = req.body.disipline.title;
  const user = req.body.cobro._id;
  const employee = req.user._id;
  let cobro = {
    amount: amount,
    user: user,
    employee: employee,
    disciplineTitle: disciplineTitle
  };
  var cobroEntity = new Cobro(cobro);
  cobroEntity.save(function (errorr, cobroSave) {
    if (errorr) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(errorr)
      });
    } else {
      User.findById({ _id: user }).exec(function (err, userCobro) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          if (userCobro.status === 'newActivo') {
            userCobro.status = 'Activo';
            userCobro.expiration = new Date();
          }
          cobroSave.firstPeriod = userCobro.expiration;
          if (!Date.parse(userCobro.expiration)) {
            userCobro.expiration = moment().add(1, 'months').toISOString();
          } else {
            const next = moment(userCobro.expiration).add(1, 'months').toISOString();
            userCobro.expiration = next;
          }
          cobroSave.lastPeriod = userCobro.expiration;
          cobroSave.save();
          userCobro.discipline = cobroId;
          userCobro.save(function (error, response) {
            if (error) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
              });
            } else {
              return res.status(200).send({
                message: 'ok'
              });
            }
          });
          // res.jsonp({userCobro: userCobro});
        }
      });
    }
  });
};

/**
 * Create a Cobro
 */
exports.data = function (req, res) {
  User.findById({ _id: req.query.userId }).populate('discipline').exec(function (err, user) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Article.find().exec(function (er, discipline) {
        if (er) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(er)
          });
        } else {
          res.jsonp({ user: user, disciplines: discipline });
        }
      });
    }
  });
};

/**
 * Show the current Cobro
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var cobro = req.cobro ? req.cobro.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  cobro.isCurrentUserOwner = req.user && cobro.user && cobro.user._id.toString() === req.user._id.toString();

  res.jsonp(cobro);
};

/**
 * Update a Cobro
 */
exports.update = function (req, res) {
  var cobro = req.cobro;

  cobro = _.extend(cobro, req.body);

  cobro.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cobro);
    }
  });
};

/**
 * Delete an Cobro
 */
exports.delete = function (req, res) {
  var cobro = req.cobro;

  cobro.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cobro);
    }
  });
};

/**
 * List of Cobros
 */
exports.list = function (req, res) {
  Cobro.find().sort('-created').populate('user', 'displayName').populate('employee', 'displayName').exec(function (err, cobros) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cobros);
    }
  });
};

/**
 * Cobro middleware
 */
exports.cobroByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cobro is invalid'
    });
  }

  Cobro.findById(id).populate('user', 'displayName').exec(function (err, cobro) {
    if (err) {
      return next(err);
    } else if (!cobro) {
      return res.status(404).send({
        message: 'No Cobro with that identifier has been found'
      });
    }
    req.cobro = cobro;
    next();
  });
};
