'use strict';

const mongoose = require('mongoose');

let config = null;
const defaultConfig = Object.freeze({});
const defaultConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 3000
};

const getConfig = () => config || defaultConfig;

module.exports = {
  init: function(newConfig) {
    config = Object.freeze(Object.assign({}, newConfig));
  },
  config: getConfig,
  connect: function(uri, options) {
    uri = uri || getConfig().uri || 'mongodb://localhost:27017/test';
    options = options || getConfig().options || defaultConnectionOptions;

    return mongoose.connect(uri, options);
  },
  createConnection: function(uri, options) {
    uri = uri || getConfig().uri || 'mongodb://localhost:27017/test';
    options = options || getConfig().options || defaultConnectionOptions;

    return mongoose.createConnection(uri, options);
  }
};