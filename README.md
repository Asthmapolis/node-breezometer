# node-breezometer

node-breezometer is a module for making HTTP requests to the breezometer.com webservices API.

## Installation

npm install node-breezometer --save

## Quick Examples

```javascript
const breezometer = require('node-breezometer');

const client = airnow({ apiKey: 'my breezometer API key' });

// get the current AQI by geocode
client.getAirQuality({ lat: 43.067475, lon:-89.392808 }, function(err, data){
	
});

// get the historical air quality for a datetime
client.getHistoricalAirQuaility({ lat: 43.067475, lon:-89.392808, datetime: new Date(Date.now() - 864000000) }, function(err, data){
	
});

// get the historical air quality for a timespan
client.getHistoricalAirQuaility({ lat: 43.067475, lon:-89.392808, startDate: new Date(Date.now() - 1728000000), endDate: new Date(Date.now() - 864000000), interval:1 }, function(err, data){
	
});

// get a forecast for the next 8 hours
client.getForecast({ lat: 43.067475, lon:-89.392808, hours:8 }, function(err, data){
	
});

// get a forecast for a date range
client.getForecast({ lat: 43.067475, lon:-89.392808, startDate: new Date(), endDate: new Date(Date.now() + 864000000) }, function(err, data){
	
});
```

## Features

1. Current Air Quality
2. Historical Air Quality
3. Forecasts
3. Exponential backoff for retrying failed requests

## getAirQuality

Get the current air quality for a location.

### example
```javascript
const breezometer = require('node-breezometer');

const client = breezometer({ apiKey: 'my breezometer API key' });

// build my options
var options = {
	lat: 43.067475,
	lon:-89.392808
};

// get the forecast by zip
client.getAirQuality(options, function(err, data){
	if (err){
		console.log('derp! an error calling getAirQuality: ' + err);
	} else {
		// the world is good! start processing the air quality
	}
});
```

### options
| Parameter | Description                   | Type   | Required |
|-----------|-------------------------------|--------|----------|
| lat       | WGS84 standard latitude       | Number | Yes      |
| lon       | WGS84 standard latitude       | Number | Yes      |
| lang      | language used for the request | String | No       |

## getHistoricalAirQuaility

Gets air quality data for a location at a single datetime or a date range.

### example single point in time
```javascript
const breezometer = require('node-breezometer');

const client = breezometer({ apiKey: 'my breezometer API key' });

// build my options
var options = {
	lat: 43.067475,
	lon:-89.392808,
	datetime: new Date(Date.now() - 864000000)
};

// get the historical air quality for a datetime
client.getHistoricalAirQuaility(options function(err, data){
	if (err){
		console.log();
	} else {
		// the world is good! start processing the air quality
	}
});
```

### example date range
```javascript
const breezometer = require('node-breezometer');

const client = breezometer({ apiKey: 'my breezometer API key' });

// build my options
var options = {
	lat: 43.067475,
	lon:-89.392808,
	startDate: new Date(Date.now() - 1728000000),
	endDate: new Date(Date.now() - 864000000),
	interval: 1
};

// get the historical air quality for a date range
client.getHistoricalAirQuaility(options function(err, data){
	if (err){
		console.log();
	} else {
		// the world is good! start processing the air quality reports
	}
});
```

### options
| Parameter | Description                                                      | Type   | Required |
|-----------|------------------------------------------------------------------|--------|----------|
| lat       | WGS84 standard latitude                                          | Number | Yes      |
| lon       | WGS84 standard latitude                                          | Number | Yes      |
| lang      | language used for the request                                    | String | No       |
| datetime  | ISO8601 date and time you want historical air quality for        | Date   | No       |
| startDate | ISO8601 start date for a range of historical air quality results | Date   | No       |
| endDate   | ISO8601 end date for a range of historical air quality results   | Date   | No       |
| interval  | A time interval represents a period of time (hours)              | Number | No       |

## getForecast

Gets future forecasts for a location.

### example hours
```javascript
const breezometer = require('node-breezometer');

const client = breezometer({ apiKey: 'my breezometer API key' });

// build my options
var options = {
	lat: 43.067475,
	lon:-89.392808,
	hours: 8
};

// get an hourly forecast for a location for the next 8 hours
client.getForecast(options function(err, data){
	if (err){
		console.log();
	} else {
		// the world is good! start processing the hourly air quality forecasts
	}
});
```

### example date range
```javascript
const breezometer = require('node-breezometer');

const client = breezometer({ apiKey: 'my breezometer API key' });

// build my options
var options = {
	lat: 43.067475,
	lon:-89.392808,
	startDate: new Date(),
	endDate: new Date(Date.now() + 864000000)
};

// get an hourly forecast for the next 24 hours
client.getForecast(options function(err, data){
	if (err){
		console.log();
	} else {
		// the world is good! start processing the hourly air quality forecasts
	}
});
```

### options
| Parameter | Description                                                                    | Type   | Required |
|-----------|--------------------------------------------------------------------------------|--------|----------|
| lat       | WGS84 standard latitude                                                        | Number | Yes      |
| lon       | WGS84 standard latitude                                                        | Number | Yes      |
| lang      | language used for the request                                                  | String | No       |
| startDate | A specific start date range to get predictions for.,Can not be used with hours | Date   | No       |
| endDate   | IA specific end date range to get predictions for.,Can not be used with hours  | Date   | No       |
| hours     | Number of hourly forecasts to receive from now                                 | Number | No       |

## Contributing

The more PRs the merrier. :-)