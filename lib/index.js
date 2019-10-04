/*jslint node: true */
/** @module breezometer/client */
'use strict'
const _             = require('underscore');
const packageJson   = require('../package.json');

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
        },
        resolveWithFullResponse: true
    });

    let airQuality = require('./airQuality')(options);
    let pollen = require('./pollen')(options);
    let fire = require('./fire')(options);

    return _.extend(airQuality, pollen, fire);
};