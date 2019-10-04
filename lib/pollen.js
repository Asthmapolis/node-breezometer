/*jsline node: true */
'use strict';

const _             = require('underscore');
const async         = require('async');
                      require('request');
const Joi           = require('joi');
const rp            = require('request-promise-native');
const constants     = require('./constants');

module.exports = function(options){
    // save some goodies
    let apiKey = options.apiKey;
    let retryTimes = options.retryTimes;
    let logger = options.logger;

    // build a base request object
    let baseRequest = rp.defaults(_.omit(options, ['apiKey', 'retryTimes', "logger"]));

    return {
        /** callback for getPollenDailyForecast
         * @callback module:breezometer/client~getDailyPollenForecastCallback
         * @param {Object} [err] error calling Breezometer
         * @param {Object} [result] Pollen Forecase
         */
        /**
         * @func getDailyPollenForecast
         * @param {Object} options containing the send info
         * @param {Number} options.lat WGS84 standard latitude
         * @param {Number} options.lng WGS84 standard longitude
         * @param {Number} options.days Number from 1 to 3 that indicates how many days forecast to request
         * @param {String} [options.lang=en] language used for the request
         * @param {String[]} [options.features] sets the data fields returned by the response
         * @param {Boolean} [options.metadata] includes request metadata in the response
         * @param {module:breezometer/client~getDailyPollenForecastCallback} [callback] callback
         */
        getDailyPollenForecast: async function getDailyPollenForecast(options, callback) {
            let asyncFx = _.isNull(callback) || _.isUndefined(callback);

            // input validation
            let requestSchema = Joi.object().keys({
                lat: Joi.number().min(-90).max(90).required(),
                lon: Joi.number().min(-180).max(180).required(),
                days: Joi.number().min(1).max(3).required(),
                lang: Joi.string().empty('').empty(null).valid(['en']).optional(),
                features: Joi.array().single().unique().min(1).max(2).items(
                    Joi.string().valid([
                        'types_information',
                        'plants_information'
                    ])
                ).optional(),
                metadata: Joi.bool().optional(),
                key: Joi.string().default(apiKey).forbidden()
            }).required();

            let validateResult = Joi.validate(options, requestSchema);
            if (!_.isNull(validateResult.error) && !_.isUndefined(validateResult.error)) {
                if (asyncFx) {
                    throw new Error(validateResult.error);
                } else {
                    callback(validateResult.error);
                    return;
                }
            } else {
                let qs = validateResult.value;

                if (_.has(qs, 'features')){
                    qs.features = qs.features.join();
                }

                let result = null;
                for (let i = 0; i < retryTimes; i++) {
                    if (i !== 0) {
                        // exponentially backoff
                        await new Promise((resolve) => {
                            let delay = Math.min(50 * Math.pow(2, i), constants.MAX_RETRY_INTERVAL);
                            setTimeout(resolve, delay);
                        });
                    }

                    try {
                        let message = await baseRequest({
                            uri: "/pollen/v2/forecast/daily?",
                            qs: qs,
                            json: true
                        });

                        if (message.statusCode != 200) {
                            logger.error({statusCode:message.statusCode, body: message.body},
                                'Did not receive a 200 status code from Breezometer getDailyPollenForecast');
                            throw new Error('Did not receive a 200 status code from Breezometer getDailyPollenForecast');
                        } else if (!_.isNull(message.body.error) && !_.isUndefined(message.body.error)) {
                            if (message.body.error.code === 'location_unsupported') {
                                logger.info({error:message.body.error, qs:qs},
                                    'Location not supported by Breezometer');
                                break;
                            } else {
                                logger.error({body:message.body, qs:qs},
                                    'Application level error returned from breezometer');
                                throw new Error('Application error returned from Breezometer. Error: '+message.body);
                            }
                        } else {
                            result = message.body;
                            break;
                        }
                    } catch (sendErr) {
                        logger.error(sendErr, 'Error calling Breezometer getDailyPollenForecast');

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
}