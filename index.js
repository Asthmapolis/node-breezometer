/*jslint node: true */
/** @module breezometer/client */
'use strict'
const async         = require('async');
const request       = require('request');
const _             = require('underscore');
const Joi           = require('joi');
const moment        = require('moment');
const packageJson   = require('./package.json');

// constants
const MAX_RETRY_INTERVAL = 60000;
const NOW_BUFFER = 1000;

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
        baseUrl: "https://api.breezometer.com/",
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
        * @param {String[]} [options.fields] filter the response to only have specific fields
        * @param {module:breezometer/client~getAirQualityCallback} [callback] callback
		*/
        getAirQuality: function getAirQuality(options, callback){
            if (_.isUndefined(callback) || _.isNull(callback)) callback = _.noop;

            // input validation
            let requestSchema = Joi.object().keys({
                lat: Joi.number().min(-90).max(90).required(),
                lon: Joi.number().min(-180).max(180).required(),
                lang: Joi.string().empty('').empty(null).valid(['en','he']).optional(),
                fields: Joi.array().single().unique().min(1).max(15).items(
                    Joi.string().valid([
                        'breezometer_aqi',
                        'breezometer_description',
                        'country_aqi_prefix',
                        'country_color',
                        'breezometer_color',
                        'country_name',
                        'country_aqi',
                        'country_description',
                        'dominant_pollutant_canonical_name',
                        'dominant_pollutant_description',
                        'dominant_pollutant_text',
                        'datetime',
                        'pollutants',
                        'data_valid',
                        'random_recommendations']))
                .optional(),
                key: Joi.string().default(apiKey).forbidden()
            }).required();

            Joi.validate(options, requestSchema, function validateResults(err, qs){
                if (!_.isUndefined(err) && !_.isNull(err)){
                    callback(err);
                } else {

                    // project fields to a comma seperated query string param
                    if (_.has(qs, 'fields')){
                        qs.fields = qs.fields.join();
                    }
                    
                    // send with exponential backoff
                    async.retry({ 
                        times: retryTimes,
                        interval: function getRetryInterval(retryCount){
                            return Math.min(50 * Math.pow(2, retryCount), MAX_RETRY_INTERVAL);
                        }
                    }, function(callback){
                        baseRequest({
                            uri: "baqi/?",
                            qs: qs,
                            json: true
                        }, function getAirQualityHTTPResponse(err, message, body){
                            if (!_.isUndefined(err) && !_.isNull(err)){
                                logger.error({err:err, qs:qs}, 'Error calling Breezometer getAirQuality');
                                callback(err);
                            } else if (message.statusCode !== 200){
                                logger.error({statusCode:message.statusCode, body: message.body, qs:qs},
                                    'Did not receive a 200 status code from Breezometer getAirQuality');
                                callback(new Error('Did not receive a HTTP 200 from Breezometer getAirQuality. Error:'+message.body));
                            } else if (_.has(body, 'error') && (body.error.code === 20 || body.error.code === 21)){
                                logger.info({error:body.error, qs:qs},
                                    'Location not supported by Breezometer');
                                callback();
                            } else if (_.has(body, 'error')){
                                logger.error({body:body, qs:qs},
                                    'Application level error returned from breezometer');
                                callback(new Error('Application error returned from Breezometer. Error: '+message.body));
                            } else {
                                // cast the datetime field to a date
                                if (_.has(body, 'datetime')){
                                    body.dateime = moment.utc(body.datetime, moment.ISO_8601);
                                }

                                callback(err, body);
                            }
                        });
                    }, callback);
                }
            });
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
        * @param {String[]} [options.fields] filter the response to only have specific fields
        * @param {Date} [options.dateTime] ISO8601 date and time you want historical air quality for
        * @param {Date} [options.startDate] ISO8601 start date for a range of historical air quality results
        * @param {Date} [options.endDate] ISO8601 end date for a range of historical air quality results
        * @param {Number} [options.interval] A time interval represents a period of time (hours) between two BAQI objects. You can choose an interval value (Integer) between 1-24 hours
        * @param {module:breezometer/client~getHistoricalAirQuailityCallback} [callback] callback
		*/
        getHistoricalAirQuaility: function getHistoricalAirQuaility(options, callback){
            if (_.isUndefined(callback) || _.isNull(callback)) callback = _.noop;

            // input validation
            let schema = Joi.object().keys({
                lat: Joi.number().min(-90).max(90).required(),
                lon: Joi.number().min(-180).max(180).required(),
                lang: Joi.string().empty('').empty(null).valid(['en','he']).optional(),
                fields: Joi.array().single().unique().min(1).max(15).items(
                    Joi.string().valid([
                        'breezometer_aqi',
                        'breezometer_description',
                        'country_aqi_prefix',
                        'country_color',
                        'breezometer_color',
                        'country_name',
                        'country_aqi',
                        'country_description',
                        'dominant_pollutant_canonical_name',
                        'dominant_pollutant_description',
                        'dominant_pollutant_text',
                        'datetime',
                        'pollutants',
                        'data_valid',
                        'random_recommendations'])
                ).optional(),
                key: Joi.string().default(apiKey).forbidden(),
                datetime: Joi.date().max(new Date(Date.now() - NOW_BUFFER)).optional(),
                start_datetime: Joi.date().max(Joi.ref('end_datetime')).optional(),
                end_datetime: Joi.date().max(new Date(Date.now() - NOW_BUFFER)).optional(),
                interval: Joi.number().min(1).max(24).optional()
            })
            .rename('dateTime', 'datetime')
            .rename('startDate', 'start_datetime')
            .rename('endDate', 'end_datetime')
            .and(['start_datetime', 'end_datetime'])
            .xor('datetime', 'start_datetime')
            .without('datetime', ['start_datetime','end_datetime'])
            .with('interval', ['start_datetime', 'end_datetime'])
            .required();

            Joi.validate(options, schema, function validateResults(err, qs){
                if (!_.isUndefined(err) && !_.isNull(err)){
                    callback(err);
                } else {
                    
                    // project fields to a comma seperated query string param
                    if (_.has(qs, 'fields')){
                        qs.fields = qs.fields.join();
                    }

                    // time based queries are closest older air quality report. 
                    // so some awkwarness on precision here; help out by rounding seconds
                    if (_.has(qs, 'datetime')){
                        qs.datetime = moment.utc(qs.datetime)
                            .endOf('second').toDate();
                    }
                    if (_.has(qs, 'start_datetime')){
                        qs.start_datetime = moment.utc(qs.start_datetime)
                            .startOf('second').toDate();
                    }
                    if (_.has(qs, 'end_datetime')){
                        qs.end_datetime = moment.utc(qs.end_datetime)
                            .endOf('second').toDate();
                    }

                    // send with exponential backoff
                    async.retry({ 
                        times: retryTimes, 
                        interval: function getRetryInterval(retryCount){
                            return Math.min(50 * Math.pow(2, retryCount), MAX_RETRY_INTERVAL);
                        }
                    }, function(callback){
                        baseRequest({
                            uri: "baqi/?",
                            qs: qs,
                            json: true
                        }, function getHistoricalAirQuailityHTTPResponse(err, message, body){
                            if (!_.isUndefined(err) && !_.isNull(err)){
                                logger.error(err, 'Error calling Breezometer getHistoricalAirQuaility');
                                callback(err);
                            } else if (message.statusCode !== 200){
                                logger.error({statusCode:message.statusCode, body: message.body},
                                    'Did not receive a 200 status code from Breezometer getHistoricalAirQuaility');
                                callback(new Error('Did not receive a HTTP 200 from Breezometer getHistoricalAirQuaility. Error:'+message.body));
                            } else if (_.has(body, 'error') && (body.error.code === 20 || body.error.code === 21)){
                                logger.info({error:body.error, qs:qs},
                                    'Location not supported by Breezometer');
                                callback();
                            } else if (_.has(body, 'error')){
                                logger.error({body:body, qs:qs},
                                    'Application level error returned from breezometer');
                                callback(new Error('Application error returned from Breezometer. Error: '+message.body));
                            } else {
                                // cast the datetime field to a date
                                if (_.has(body, 'datetime')){
                                    body.dateime = moment.utc(body.datetime, moment.ISO_8601);
                                }

                                callback(err, body);
                            }
                        });
                    }, callback);                    
                }
            });
        },
        
        /** callback for getForecast
		* @callback module:breezometer/client~getForecastCallback
		* @param {Object} [err] error calling Breezometer
		* @param {Object} [result] Forecasts
		*/
		/**
		* @func getForecastCallback
		* @param {Object} options object containing the send info
        * @param {Number} options.lat WGS84 standard latitude
        * @param {Number} options.lng WGS84 standard longitude
        * @param {String} [options.lang=en] language used for the request 
        * @param {String[]} [options.fields] filter the response to only have specific fields
        * @param {Number} [options.hours=24{1,24}] Number of hourly forecasts to receive from now
        * @param {Date} [options.startDate] A specific start date range to get predictions for.  Can not be used with hours
        * @param {Date} [options.endDate] A specific end date range to get predictions for.  Can not be used with hours 
        * @param {module:breezometer/client~getForecastCallback} [callback] callback
		*/
        getForecast: function getForecast(options, callback){
            if (_.isUndefined(callback) || _.isNull(callback)) callback = _.noop;

            // input validation
            let schema = Joi.object().keys({
                lat: Joi.number().min(-90).max(90).required(),
                lon: Joi.number().min(-180).max(180).required(),
                lang: Joi.string().empty('').empty(null).valid(['en','he']).optional(),
                fields: Joi.array().single().unique().min(1).max(15).items(
                    Joi.string().valid([
                        'breezometer_aqi',
                        'breezometer_description',
                        'country_aqi_prefix',
                        'country_color',
                        'breezometer_color',
                        'country_name',
                        'country_aqi',
                        'country_description',
                        'dominant_pollutant_canonical_name',
                        'dominant_pollutant_description',
                        'dominant_pollutant_text',
                        'datetime',
                        'pollutants',
                        'data_valid',
                        'random_recommendations'])
                ).optional(),
                key: Joi.string().default(apiKey).forbidden(),
                hours: Joi.number().integer().min(1).max(24).optional(),
                start_datetime: Joi.date().min(new Date(Date.now() - NOW_BUFFER)).optional(),
                end_datetime: Joi.date().min(Joi.ref('start_datetime')).optional()
            })
            .rename('startDate', 'start_datetime')
            .rename('endDate', 'end_datetime')
            .and(['start_datetime', 'end_datetime'])
            .xor('hours', 'start_datetime')
            .without('hours', ['start_datetime','end_datetime'])
            .required();

            Joi.validate(options, schema, function validateResults(err, qs){
                if (!_.isUndefined(err) && !_.isNull(err)){
                    callback(err);
                } else {

                    // project fields to a comma seperated query string param
                    if (_.has(qs, 'fields')){
                        qs.fields = qs.fields.join();
                    }

                    // time based queries are closest older air quality report. 
                    // so some awkwarness on precision here; help out by rounding seconds
                    if (_.has(qs, 'start_datetime')){
                        qs.start_datetime = moment.utc(qs.start_datetime)
                            .startOf('second').toDate();
                    }
                    if (_.has(qs, 'end_datetime')){
                        qs.end_datetime = moment.utc(qs.end_datetime)
                            .endOf('second').toDate();
                    }

                    // send with exponential backoff
                    async.retry({ 
                        times: retryTimes, 
                        interval: function getRetryInterval(retryCount){
                            return Math.min(50 * Math.pow(2, retryCount), MAX_RETRY_INTERVAL);
                        }
                    }, function(callback){
                        baseRequest({
                            uri: "forecast/?",
                            qs: qs,
                            json: true
                        }, function getForecastHTTPResponse(err, message, body){
                            if (!_.isUndefined(err) && !_.isNull(err)){
                                logger.error(err, 'Error calling Breezometer getForecast');
                                callback(err);
                            } else if (message.statusCode !== 200){
                                logger.error({statusCode:message.statusCode, body: message.body},
                                    'Did not receive a 200 status code from Breezometer getForecast');
                                callback(new Error('Did not receive a HTTP 200 from Breezometer getForecast. Error:'+message.body));
                            } else if (_.has(body, 'error') && (body.error.code === 20 || body.error.code === 21)){
                                logger.info({error:body.error, qs:qs},
                                    'Location not supported by Breezometer');
                                callback();
                            } else if (_.has(body, 'error')){
                                logger.error({body:body, qs:qs},
                                    'Application level error returned from breezometer');
                                callback(new Error('Application error returned from Breezometer. Error: '+message.body));
                            } else {
                                // cast the datetime field to a date
                                if (_.has(body, 'datetime')){
                                    body.dateime = moment.utc(body.datetime, moment.ISO_8601);
                                }

                                callback(err, body);
                            }
                        });
                    }, callback);
                }
            });
        }
    };
};