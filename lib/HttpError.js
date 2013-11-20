"use strict";

/* jshint node:true */

var Util = require("util");

/**
 * @class  HttpError
 *
 * @constructor
 * @param {Number} statusCode
 * @param {String} body
 */
var HttpError = function () {
  var args       = Array.prototype.slice(arguments);
  var statusCode = args.shift();
  var body       = args.shift();

  Error.apply(this, args);
};

Util.inherits(HttpError, Error);

module.exports = HttpError;
