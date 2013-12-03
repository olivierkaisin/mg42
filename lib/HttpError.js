"use strict";

/* jshint node:true */

var Util = require("util")
  , _    = require("lodash");

/**
 * @class  HttpError
 *
 * @constructor
 * @param {Number} statusCode
 * @param {String} body
 */
var HttpError = function () {

  var args =  _.values(arguments);

  var statusCode = args.shift()
    , body       = args.shift();

  Error.apply(this, args);

};

Util.inherits(HttpError, Error);

module.exports = HttpError;
