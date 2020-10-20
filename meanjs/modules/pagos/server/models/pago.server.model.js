'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Pago Schema
 */
var PagoSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Por favor ingrese un titulo',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  price: {
    type: String,
    default: 0,
    required: 'Por favor ingrese un monto'
  },
  description: {
    type: String,
    default: '',
    required: 'Por favor ingrese una descripción'
  }
});

mongoose.model('Pago', PagoSchema);
