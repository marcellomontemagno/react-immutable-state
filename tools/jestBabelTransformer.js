const babelConfigObj = require('./babel.js');

module.exports = require('babel-jest').createTransformer(babelConfigObj);
