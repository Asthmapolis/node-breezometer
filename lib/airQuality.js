/*jsline node: true */
'use strict';

const async         = require('async');
                      require('request');
const rp            = require('request-promise-native');
const _             = require('underscore');
const Joi           = require('joi');
const moment        = require('moment');
const util          = require('util');
const constants     = require('./constants');

module.exports = function(options) {
    // save some goodies
    let apiKey = options.apiKey;
    let retryTimes = options.retryTimes;
    let logger = options.logger;

    // build a base request object
    let baseRequest = rp.defaults(_.omit(options, ['apiKey', 'retryTimes', "logger"]));

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
        * @param {String[]} [options.features] sets the data fields returned by the response
        * @param {Boolean} [options.metadata] includes request metadata in the response
        * @param {module:breezometer/client~getAirQualityCallback} [callback] callback
        */
        getAirQuality: async function getAirQuality(options, callback){
            let asyncFx = _.isUndefined(callback) || _.isNull(callback);

            // input validation
            let requestSchema = Joi.object().keys({
                lat: Joi.number().min(-90).max(90).required(),
                lon: Joi.number().min(-180).max(180).required(),
                lang: Joi.string().empty('').empty(null).valid(['en','fr']).optional(),
                features: Joi.array().single().unique().min(1).max(7).items(
                    Joi.string().valid([
                        'breezometer_aqi',
                        'local_aqi',
                        'health_recommendations',
                        'sources_and_effects',
                        'dominant_pollutant_concentrations',
                        'pollutants_concentrations',
                        'pollutants_aqi_information'
                    ])
                ).optional(),
                metadata: Joi.bool().optional(),
                key: Joi.string().default(apiKey).forbidden()
            }).required();

            // input validation
            let validateResult = Joi.validate(options, requestSchema);
            if (!_.isNull(validateResult.error)){
                if (asyncFx){
                    throw new Error(validateResult.error);
                } else {
                    callback(validateResult.error);
                    return;
                }
            } else {
                let qs = validateResult.value;

                // project features to a comma seperated query string param
                if (_.has(qs, 'features')){
                    qs.features = qs.features.join();
                }

                let result = null;
                for (let i =0; i < retryTimes; i++){
                    if (i !== 0){
                        await new Promise((resolve)=>{
                            let delay = Math.min(50 * Math.pow(2, i), constants.MAX_RETRY_INTERVAL);
                            setTimeout(resolve, delay); 
                        });
                    }

                    try {
                        let message = await baseRequest({
                            uri: "air-quality/v2/current-conditions?",
                            qs: qs,
                            json: true
                        });
                        
                        if (message.statusCode !== 200){
                            logger.error({statusCode:message.statusCode, body: message.body},
                                'Did not receive a 200 status code from Breezometer getAirQuality');
                            throw new Error('Did not receive a 200 status code from Breezometer getAirQuality');
                        } else if (!_.isNull(message.body.error) && !_.isUndefined(message.body.error)) {
                            if (message.body.error.code === 20 || message.body.error.code === 21) {
                                logger.info({error:message.body.error, qs:qs},
                                    'Location not supported by Breezometer');
                                break;
                            } else {
                                logger.error({body:message.body, qs:qs},
                                    'Application level error returned from breezometer');
                                throw new Error('Application error returned from Breezometer. Error: '+message.body);
                            }
                        } else {
                            // cast the datetime field to a date
                            if (_.has(message.body.data, 'datetime')){
                                message.body.data.datetime = moment.utc(message.body.data.datetime, moment.ISO_8601).toDate();
                            }

                            result = message.body;
                            break;
                        }
                    } catch (sendErr){
                        logger.error(sendErr, 'Error calling Breezometer getAirQuality');
                        if (i + 1 === retryTimes){
                            if (asyncFx){
                                throw new Error(sendErr);
                            } else {
                                callback(sendErr);
                                return;
                            }
                        }
                    }
                }

                if (asyncFx){
                    return result;
                } else {
                    callback(null, result);
                }
            }
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
        * @param {String[]} [options.features] sets the data fields returned by the response
        * @param {Date} [options.dateTime] ISO8601 date and time you want historical air quality for
        * @param {Date} [options.startDate] ISO8601 start date for a range of historical air quality results
        * @param {Date} [options.endDate] ISO8601 end date for a range of historical air quality results
        * @param {Number} [options.hours] Number of historical hourly forecasts to receive
        * @param {Boolean} [options.metadata] includes request metadata in the response
        * @param {module:breezometer/client~getHistoricalAirQuaility} [callback] callback
        */
        getHistoricalAirQuaility: async function getHistoricalAirQuaility(options, callback){
            let asyncFx = _.isUndefined(callback) || _.isNull(callback);

            // build the schema
            let requestSchema = Joi.object().keys({
                lat: Joi.number().min(-90).max(90).required(),
                lon: Joi.number().min(-180).max(180).required(),
                lang: Joi.string().empty('').empty(null).valid(['en','fr']).optional(),
                features: Joi.array().single().unique().min(1).max(7).items(
                    Joi.string().valid([
                        'breezometer_aqi',
                        'local_aqi',
                        'health_recommendations',
                        'sources_and_effects',
                        'dominant_pollutant_concentrations',
                        'pollutants_concentrations',
                        'pollutants_aqi_information'
                    ])
                ).optional(),
                key: Joi.string().default(apiKey).forbidden(),
                metadata: Joi.bool().optional(),
                datetime: Joi.date().max(new Date(Date.now() - constants.NOW_BUFFER)).optional(),
                start_datetime: Joi.date().max(Joi.ref('end_datetime')).optional(),
                end_datetime: Joi.date().max(new Date(Date.now() - constants.NOW_BUFFER)).optional(),
                hours: Joi.number().min(1).max(96).optional(),
            })
            .rename('dateTime', 'datetime')
            .rename('startDate', 'start_datetime')
            .rename('endDate', 'end_datetime')
            .and(['start_datetime', 'end_datetime'])
            .xor('datetime', 'start_datetime', 'hours')
            .without('datetime', ['start_datetime','end_datetime', 'hours'])
            .without('hours', ['start_datetime','end_datetime'])
            .required();

            // input validation
            let validateResult = Joi.validate(options, requestSchema);
            if (!_.isNull(validateResult.error)){
                if (asyncFx){
                    throw new Error(validateResult.error);
                } else {
                    callback(validateResult.error);
                    return;
                }
            } else {
                let qs = validateResult.value;

                // project fields to a comma seperated query string param
                if (_.has(qs, 'features')){
                    qs.features = qs.features.join();
                }

                // time based queries are closest older air quality report. 
                // so some awkwarness on precision here; help out by rounding seconds
                if (_.has(qs, 'datetime')){
                    qs.datetime = moment.utc(qs.datetime)
                        .endOf('minute').format(constants.DATETIME_FORMAT);
                }
                if (_.has(qs, 'start_datetime')){
                    qs.start_datetime = moment.utc(qs.start_datetime)
                        .startOf('minute').format(constants.DATETIME_FORMAT);
                }
                if (_.has(qs, 'end_datetime')){
                    qs.end_datetime = moment.utc(qs.end_datetime)
                        .endOf('minute').format(constants.DATETIME_FORMAT);
                }

                let result = null;
                for (let i =0; i < retryTimes; i++){
                    if (i !== 0){
                        await new Promise((resolve)=>{
                            let delay = Math.min(50 * Math.pow(2, i), constants.MAX_RETRY_INTERVAL);
                            setTimeout(resolve, delay); 
                        });
                    }

                    try {
                        let message = await baseRequest({
                            uri: "air-quality/v2/historical/hourly?",
                            qs: qs,
                            json: true
                        });
                        
                        if (message.statusCode !== 200){
                            logger.error({statusCode:message.statusCode, body: message.body},
                                'Did not receive a 200 status code from Breezometer getHistoricalAirQuaility');
                            throw new Error('Did not receive a 200 status code from Breezometer getHistoricalAirQuaility');
                        } else if (!_.isNull(message.body.error) && !_.isUndefined(message.body.error)) {
                            if (message.body.error.code === 20 || message.body.error.code === 21) {
                                logger.info({error:message.body.error, qs:qs},
                                    'Location not supported by Breezometer');
                                break;
                            } else {
                                logger.error({body:message.body, qs:qs},
                                    'Application level error returned from breezometer');
                                throw new Error('Application error returned from Breezometer. Error: '+message.body);
                            }
                        } else {
                            // cast the datetime field to a date
                            if (_.has(message.body.data, 'datetime')){
                                message.body.data.datetime = moment.utc(message.body.data.datetime, moment.ISO_8601).toDate();
                            }

                            result = message.body;
                            break;
                        }
                    } catch (sendErr){
                        logger.error(sendErr, 'Error calling Breezometer getHistoricalAirQuaility');
                        if (i + 1 === retryTimes){
                            if (asyncFx){
                                throw new Error(sendErr);
                            } else {
                                callback(sendErr);
                                return;
                            }
                        }
                    }
                }

                if (asyncFx){
                    return result;
                } else {
                    callback(null, result);
                }
            }
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
        * @param {Number} [options.hours] Number of hourly forecasts to receive from now
        * @param {Date} [options.startDate] A specific start date range to get predictions for.  Can not be used with hours
        * @param {Date} [options.endDate] A specific end date range to get predictions for.  Can not be used with hours 
        * @param {module:breezometer/client~getForecastCallback} [callback] callback
        */
        getForecast: async function getForecast(options, callback){
            let asyncFx = _.isUndefined(callback) || _.isNull(callback);

            // input validation
            let requestSchema = Joi.object().keys({
                lat: Joi.number().min(-90).max(90).required(),
                lon: Joi.number().min(-180).max(180).required(),
                lang: Joi.string().empty('').empty(null).valid(['en','fr']).optional(),
                features: Joi.array().single().unique().min(1).max(15).items(
                    Joi.string().valid([
                        'breezometer_aqi',
                        'local_aqi',
                        'health_recommendations',
                        'sources_and_effects',
                        'dominant_pollutant_concentrations',
                        'pollutants_concentrations',
                        'pollutants_aqi_information'])
                ).optional(),
                key: Joi.string().default(apiKey).forbidden(),
                metadata: Joi.bool().optional(),
                datetime: Joi.date().min(new Date(Date.now() - constants.NOW_BUFFER)).optional(),
                hours: Joi.number().integer().min(1).max(96).optional(),
                start_datetime: Joi.date().min(new Date(Date.now() - constants.NOW_BUFFER)).optional(),
                end_datetime: Joi.date().min(Joi.ref('start_datetime')).optional()
            })
            .rename('startDate', 'start_datetime')
            .rename('endDate', 'end_datetime')
            .and(['start_datetime', 'end_datetime'])
            .xor('datetime', 'start_datetime', 'hours')
            .without('datetime', ['start_datetime','end_datetime', 'hours'])
            .without('hours', ['start_datetime','end_datetime'])
            .required();

            // input validation
            let validateResult = Joi.validate(options, requestSchema);
            if (!_.isNull(validateResult.error)){
                if (asyncFx){
                    throw new Error(validateResult.error);
                } else {
                    callback(validateResult.error);
                    return;
                }
            } else {
                let qs = validateResult.value;

                // project fields to a comma seperated query string param
                if (_.has(qs, 'features')){
                    qs.features = qs.features.join();
                }

                // time based queries are closest older air quality report. 
                // so some awkwarness on precision here; help out by rounding seconds
                if (_.has(qs, 'start_datetime')){
                    qs.start_datetime = moment.utc(qs.start_datetime)
                        .startOf('minute').format(constants.DATETIME_FORMAT);
                }
                if (_.has(qs, 'end_datetime')){
                    qs.end_datetime = moment.utc(qs.end_datetime)
                        .endOf('minute').format(constants.DATETIME_FORMAT);
                }

                let result = null;
                for (let i =0; i < retryTimes; i++){
                    if (i !== 0){
                        await new Promise((resolve)=>{
                            let delay = Math.min(50 * Math.pow(2, i), constants.MAX_RETRY_INTERVAL);
                            setTimeout(resolve, delay); 
                        });
                    }

                    try {
                        let message = await baseRequest({
                            uri: "air-quality/v2/forecast/hourly?",
                            qs: qs,
                            json: true
                        });
                        
                        if (message.statusCode !== 200){
                            logger.error({statusCode:message.statusCode, body: message.body},
                                'Did not receive a 200 status code from Breezometer getForecast');
                            throw new Error('Did not receive a 200 status code from Breezometer getForecast');
                        } else if (!_.isNull(message.body.error) && !_.isUndefined(message.body.error)) {
                            if (message.body.error.code === 20 || message.body.error.code === 21) {
                                logger.info({error:message.body.error, qs:qs},
                                    'Location not supported by Breezometer');
                                break;
                            } else {
                                logger.error({body:message.body, qs:qs},
                                    'Application level error returned from breezometer');
                                throw new Error('Application error returned from Breezometer. Error: '+message.body);
                            }
                        } else {
                            // cast the datetime field to a date
                            for (dataObj in message.body.data) {
                                if (_.has(dataObj, 'datetime')){
                                    dataObj.datetime = moment.utc(dataObj.datetime, moment.ISO_8601).toDate();
                                }
                            }

                            result = message.body;
                            break;
                        }
                    } catch (sendErr){
                        logger.error(sendErr, 'Error calling Breezometer getForecast');
                        if (i + 1 === retryTimes){
                            if (asyncFx){
                                throw new Error(sendErr);
                            } else {
                                callback(sendErr);
                                return;
                            }
                        }
                    }
                }

                if (asyncFx){
                    return result;
                } else {
                    callback(null, result);
                }

            }
        }
    }
};