"use strict";

/* jshint node:true, laxcomma:true */

/**
 * @module mg42
 * @class  Shooter
 */


var Q              = require("q")
  , request        = require("request")
  , HttpError      = require("./HttpError")
  , Http           = require("http")
  , Events         = require("events");


/**
 * @var {Http.Agent}
 */
var httpAgent = new Http.Agent();


/**
 * Sets the maximum amount of sockets allowed in the HTTP pool.
 *
 * @method setMaxSockets
 * @public
 *
 * @param {Number} maxSockets
 */
var setMaxSockets = function (maxSockets) {
  httpAgent.maxSockets = maxSockets;
};

/**
 * Shoots once on an HTTP service.
 *
 * @method shootOnce
 * @public
 *
 * @param  {Object} options
 * @param  {Object} options.form
 * @param  {Object} options.json
 * @param  {Object} options.qs
 * @param  {String} options.method
 *
 * @return {Promise:String}
 */
var shootOnce = function (options) {

  // Setup request params
  var params = {
    url      : options.url,
    timeout  : options.timeout || 10000,
    encoding : "utf8",
    pool     : httpAgent,
    form     : options.form,
    json     : options.json,
    qs       : options.qs,
    method   : options.method
  };

  var deferred = Q.defer();

  var req = request(params, function (error, res, body) {

    if (error) {

      // Failed upfront
      deferred.reject(error);
    }
    else {
      if (res.statusCode === 200) {

        // Request was OK
        deferred.resolve(body);
      }
      else {

        // Reject with an HTTP error
        deferred.reject(new HttpError(res.statusCode, body));
      }
    }

  });

  req.on("error", function (error) {
    deferred.reject(error);
  });

  return deferred.promise;
};

/**
 * Shoots multiple times on a certain endpoint.
 *
 * @method shootMultiple
 * @public
 *
 * @param  {Object} options
 * @param  {String} options.url
 * @param  {Number} options.number
 * @param  {Number} options.parallelRequests
 * @param  {Object} options.form
 * @param  {Object} options.json
 * @param  {Object} options.qs
 *
 * @return {Promise:Object}
 */
var shootMultiple = function (options) {

  var url              = options.url
    , times            = options.times
    , parallelRequests = options.parallelRequests || 1
    , delay            = options.delay || 0
    , timeout          = options.timeout || 10000
    , method           = options.method
    , form             = options.form
    , json             = options.json
    , qs               = options.qs
    , progress         = options.progress || new Events.EventEmitter();

  // Initial state
  var i         = 0
    , success   = 0
    , connfails = 0
    , httpFails = 0
    , active    = 0
    , timeouts  = 0
    , avgTime   = 0, avgAmt = 0;

  // Notify function used to either send a status, either a end statement
  var notify = function (isDone) {

    var evType;
    if (isDone) {
      evType = "done";
    }
    else {
      evType = "status";
    }

    progress.emit(evType, {
      successes    : success,
      connFailures : connfails,
      httpFailures : httpFails,
      timeouts     : timeouts,
      active       : active,
      averageTime  : avgTime
    });
  };

  // Predefine the request params
  var requestParams = {
    url     : url,
    timeout : timeout,
    form    : form,
    json    : json,
    qs      : qs,
    method  : method
  };

  // Iteration implementation
  var iterate = function () {
    i++;

    if (i <= times) {

      var request = {
        id    : i,
        start : new Date(),
        end   : null,
        error : null,
        body  : null
      };

      // Emit the start
      progress.emit("start", request);
      ++active;

      return shootOnce(requestParams)

        .then(function (body) {
          --active;
          success++;

          request.body = body;
          request.end  = new Date();

          avgTime = ((request.end.getTime() - request.start.getTime()) + avgTime * avgAmt++) / avgAmt;

          // Emit the success
          progress.emit("success", request);
          notify();
        })

        .fail(function (error) {

          --active;

          if (error instanceof HttpError) {
            request.error = new Error("HTTP Error");
            httpFails++;
          }
          else if (error.code === "ETIMEDOUT") {
            request.error = new Error("Request timed out");
            timeouts++;
          }
          else {
            request.error = new Error("Connection Error");
            connfails++;
          }

          // Emit the failure
          progress.emit("progress", request);
          notify();
        })

        .delay(delay)

        .then(function () {
          return iterate();
        });

    }
    else {
      return "OK";
    }
  };

  process.nextTick(function () {

    // Start iterators
    var iterators = [];
    for (var j = 0; j < parallelRequests; ++j) {
      iterators.push(iterate());
    }

    // Closing statement
    Q.all(iterators).then(function () {
      notify(true);
    });
  });

  return progress;
};


// Wrap up exports
module.exports = {
  shootOnce     : shootOnce,
  shootMultiple : shootMultiple,
  setMaxSockets : setMaxSockets
};
