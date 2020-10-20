'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cobro Schema
 */
var CobroSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  firstPeriod: {
    type: Date,
    default: Date.now
  },
  lastPeriod: {
    type: Date,
    default: Date.now
  },
  disciplineTitle: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  employee: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Cobro', CobroSchema);
