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

  var statusCode = arguments.shift()
    , body       = arguments.shift();

  Error.apply(this, arguments);

};

Util.inherits(HttpError, Error);

module.exports = HttpError;
