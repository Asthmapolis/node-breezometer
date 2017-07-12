/*jslint node: true */
/** @module breezometer/client */
'use strict'
const async         = require('async');
const request       = require('request');
const _             = require('underscore');
const packageJson   = require('./package.json');

// constants
const MAX_RETRY_INTERVAL = 60000;

/**
* breezometerClientConstructor
* @param {Object} [options] object containing the Breezometer API client options
* @param {String} options.apiKey API key for Breezometer's API
* @param {String} [options.baseUri=https://api.breezometer.com/] base Uri of the Breezometer API
* @param {Number} [options.timeout=60000] Client timeout for a HTTP response from the Breezometer API
* @param {Number} [options.retryTimes=10] Number of times to retry a failed request
* @param {Object} [options.logger] An object that responds to node module bunyan log levels like .debug() or .error()
*/
module.exports = function breezometerClientConstructor(options){
    
    if (_.isUndefined(options) || _.isNull(options)){
        options = {}
    }

    if (!_.has(options, 'headers')){
        options.headers = {};
    }

    options = _.defaults(options, {
        baseUri: "https://api.breezometer.com/",
        uri: "",
        timeout: 60000,
        method: "GET",
        gzip: true,
        headers: _.defaults(options.headers, {
			"User-Agent": "node-breezometer/" +packageJson.version
        }),
        retryTimes: 10,
        logger: {
            fatal: _.noop,
            error: _.noop,
            warn: _.noop,
            info: _.noop,
            debug: _.noop,
            trace: _.noop
        }
    });

    // save some goodies
    let apiKey = options.apiKey;
    let retryTimes = options.retryTimes;
    let logger = options.logger;
	
	// build a base request object
	let baseRequest = request.defaults(_.omit(options, ['apiKey', 'retryTimes', "logger"]));
    
    return {

        /** callback for getAirQuality
		* @callback module:breezometer/client~getAirQualityCallback
		* @param {Object} [err] error calling Breezometer
		* @param {Object} [result] Air Quality
		*/
		/**
		* @func getAirQuality
		* @param {Object} options object containing the send info
        * @param {Number} options.lat WGS84 standard latitude
        * @param {Number} options.lng WGS84 standard longitude
        * @param {String} [options.lang=en] language used for the request 
        * @param {module:breezometer/client~getAirQualityCallback} [callback] callback
		*/
        getAirQuality: function getAirQuality(options, callback){
            if (_.isUndefined(callback) || _.isNull(callback)) callback = _.noop;
            if (_.isUndefined(options) || _.isNull(options)) return callback(new Error('Invalid options object'));
            if (!_.has(options, 'lat') || !_.isNumber(options.lat)) return callback(new Error('Invalid lat'));
            if (!_.has(options, 'lon') || !_.isNumber(options.lon)) return callback(new Error('Invalid lon'));

            // set the defaults
			_.defaults(options, {
                key: apiKey
            });
			
			// send with exponential backoff
			async.retry({ 
                times: retryTimes, 
                interval: function getRetryInterval(retryCount){
                    return Math.min(50 * Math.pow(2, retryCount), MAX_RETRY_INTERVAL);
                }
            }, function(callback){
				baseRequest({
					uri: "baqi/?",
					qs: options,
					json: true
				}, function getAirQualityHTTPResponse(err, message, body){
                    if (!_.isUndefined(err) && !_.isNull(err)){
                        logger.error(err, 'Error calling Breezometer getAirQuality');
                        callback(err);
                    } else if (message.statusCode !== 200){
                        logger.error({statusCode:statusCode, body: message.body},
                            'Did not receive a 200 status code from Breezometer getAirQuality');
                        callback(new Error('Did not receive a HTTP 200 from Breezometer getAirQuality. Error:'+message.body));
                    } else {
                        callback(err, body);
                    }
				});
			}, callback);
        },

        /** callback for getHistoricalAirQuaility
		* @callback module:breezometer/client~getHistoricalAirQuailityCallback
		* @param {Object} [err] error calling Breezometer
		* @param {Object} [result] Historical Air Quality
		*/
		/**
		* @func getHistoricalAirQuaility
		* @param {Object} options object containing the send info
        * @param {Number} options.lat WGS84 standard latitude
        * @param {Number} options.lng WGS84 standard longitude
        * @param {String} [options.lang=en] language used for the request 
        * @param {Date} options.datetime ISO8601 date and time you want historical air quality for 
        * @param {module:breezometer/client~getHistoricalAirQuailityCallback} [callback] callback
		*/
        getHistoricalAirQuaility: function getHistoricalAirQuaility(options, callback){
            if (_.isUndefined(callback) || _.isNull(callback)) callback = _.noop;
            if (_.isUndefined(options) || _.isNull(options)) return callback(new Error('Invalid options object'));
            if (!_.has(options, 'lat') || !_.isNumber(options.lat)) return callback(new Error('Invalid lat'));
            if (!_.has(options, 'lon') || !_.isNumber(options.lon)) return callback(new Error('Invalid lon'));
            if (!_.has(options, 'datetime') || !_.isDate(options.datetime)) return callback(new Error('Invalid datetime'));

            // set the defaults
			_.defaults(options, {
                key: apiKey
            });
			
			// send with exponential backoff
			async.retry({ 
                times: retryTimes, 
                interval: function getRetryInterval(retryCount){
                    return Math.min(50 * Math.pow(2, retryCount), MAX_RETRY_INTERVAL);
                }
            }, function(callback){
				baseRequest({
					uri: "baqi/?",
					qs: options,
					json: true
				}, function getHistoricalAirQuailityHTTPResponse(err, message, body){
					if (!_.isUndefined(err) && !_.isNull(err)){
                        logger.error(err, 'Error calling Breezometer getHistoricalAirQuaility');
                        callback(err);
                    } else if (message.statusCode !== 200){
                        logger.error({statusCode:statusCode, body: message.body},
                            'Did not receive a 200 status code from Breezometer getHistoricalAirQuaility');
                        callback(new Error('Did not receive a HTTP 200 from Breezometer getHistoricalAirQuaility. Error:'+message.body));
                    } else {
                        callback(err, body);
                    }
				});
			}, callback);
        },
        
        /** callback for getForecast
		* @callback module:breezometer/client~getForecastCallback
		* @param {Object} [err] error calling Breezometer
		* @param {Object} [result] Forecast
		*/
		/**
		* @func getForecastCallback
		* @param {Object} options object containing the send info
        * @param {Number} options.lat WGS84 standard latitude
        * @param {Number} options.lng WGS84 standard longitude
        * @param {String} [options.lang=en] language used for the request 
        * @param {Date} [options.hours=24{1,24}] Number of hourly forecasts to receive   
        * @param {module:breezometer/client~getForecastCallback} [callback] callback
		*/
        getForecast: function getForecast(options, callback){
            if (_.isUndefined(callback) || _.isNull(callback)) callback = _.noop;
            if (_.isUndefined(options) || _.isNull(options)) return callback(new Error('Invalid options object'));
            if (!_.has(options, 'lat') || !_.isNumber(options.lat)) return callback(new Error('Invalid lat'));
            if (!_.has(options, 'lon') || !_.isNumber(options.lon)) return callback(new Error('Invalid lon'));
            
            // set the defaults
			_.defaults(options, {
                key: apiKey
            });
			
			// send with exponential backoff
			async.retry({ 
                times: retryTimes, 
                interval: function getRetryInterval(retryCount){
                    return Math.min(50 * Math.pow(2, retryCount), MAX_RETRY_INTERVAL);
                }
            }, function(callback){
				baseRequest({
					uri: "forecast/?",
					qs: options,
					json: true
				}, function getForecastHTTPResponse(err, message, body){
					if (!_.isUndefined(err) && !_.isNull(err)){
                        logger.error(err, 'Error calling Breezometer getForecast');
                        callback(err);
                    } else if (message.statusCode !== 200){
                        logger.error({statusCode:statusCode, body: message.body},
                            'Did not receive a 200 status code from Breezometer getForecast');
                        callback(new Error('Did not receive a HTTP 200 from Breezometer getForecast. Error:'+message.body));
                    } else {
                        callback(err, body);
                    }
				});
			}, callback);
        }
    };
};