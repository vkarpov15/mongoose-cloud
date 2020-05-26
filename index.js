'use strict';

const mongoose = require('mongoose');

let config = null;
let conn = null;
const defaultConfig = Object.freeze({});
const defaultConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false,
  useFindAndModify: false,
  serverSelectionTimeoutMS: 3000
};

const getConfig = () => config || defaultConfig;
const lambdaSymbol = Symbol('mongoose-cloud:lambda');

module.exports = {
  init: function(newConfig) {
    if (config != null) {
      return;
    }
    config = Object.freeze(Object.assign({}, newConfig));
  },
  config: getConfig,
  connect: async function(uri, options) {
    if (conn != null) {
      return conn;
    }

    uri = uri || getConfig().uri || 'mongodb://localhost:27017/test';
    options = options || getConfig().options || defaultConnectionOptions;

    mongoose.connect(uri, options);
    conn = mongoose.connection;
    await conn;
  },
  // Support different syntaxes: AWS lambda syntax vs plain async functions
  lambda: function(fn) {
    fn[lambdaSymbol] = true;
    return fn;
  },
  isLambda: function(fn) {
    return fn != null && fn[lambdaSymbol];
  }
};
