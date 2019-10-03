# node-breezometer

node-breezometer is a module for making HTTP requests to the breezometer.com webservices API.

## Installation

npm install node-breezometer --save

## Quick Examples

```javascript
const breezometer = require('node-breezometer');

const client = breezometer({ apiKey: 'my breezometer API key' });

// get the current AQI by geocode

// w/callback
client.getAirQuality({ lat: 43.067475, lon:-89.392808 }, function(err, data){
	
});

// w/async await
data = await client.getAirQuality({ lat: 43.067475, lon:-89.392808 });

// get the historical air quality for a dateTime

// w/callback
client.getHistoricalAirQuaility({ lat: 43.067475, lon:-89.392808, dateTime: new Date(Date.now() - 864000000) }, function(err, data){
	
});

// w/async await
data = await client.getHistoricalAirQuaility({ lat: 43.067475, lon:-89.392808, dateTime: new Date(Date.now() - 864000000) });

// get the historical air quality for a timespan

// w/callback
client.getHistoricalAirQuaility({ lat: 43.067475, lon:-89.392808, startDate: new Date(Date.now() - 864000000), endDate: new Date(Date.now() - 432000000)}, function(err, data){
	
});

// w/async await
data = await client.getHistoricalAirQuaility({ lat: 43.067475, lon:-89.392808, hours:8 });

// get the historical air quality for the last 8 hours

// w/callback
client.getHistoricalAirQuaility({ lat: 43.067475, lon:-89.392808, hours:8 }, function(err, data){
	
});

// w/async await
data = await client.getHistoricalAirQuaility({ lat: 43.067475, lon:-89.392808, hours:8 });


// get a forecast for the next 8 hours

// w/callback
client.getForecast({ lat: 43.067475, lon:-89.392808, hours:8 }, function(err, data){
	
});

// w/async await
data = await client.getForecast({ lat: 43.067475, lon:-89.392808, hours:8 });

// get a forecast for a date range

// w/callback
client.getForecast({ lat: 43.067475, lon:-89.392808, startDate: new Date(Date.now() + 3600000), endDate: new Date(Date.now() + 864000000) }, function(err, data){
	
});

// w/async await
data = await client.getForecast({ lat: 43.067475, lon:-89.392808, startDate: new Date(Date.now() + 3600000), endDate: new Date(Date.now() + 864000000) });

// get a forecast ending at a datetime

// w/callback
client.getForecast({ lat: 43.067475, lon:-89.392808, dateTime: new Date(Date.now() + 864000000)}, function(err, data){
	
});

// w/async await
data = await client.getForecast({ lat: 43.067475, lon:-89.392808, dateTime: new Date(Date.now() + 864000000)});
```

## Air Quality Features

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
	lon:-89.392808,
	lang: 'en',
	features:['breezometer_aqi', 'local_aqi','pollutants_aqi_information']
};

// get the air quality by geocode
client.getAirQuality(options, function(err, body){
	if (err){
		console.log('derp! an error calling getAirQuality: ' + err);
	} else if (!body.data){
		// location does not have data
	} else {
		// the world is good! start processing the air quality
	}
});
```

### options
| Parameter | Description                   | Type   	| Required |
|-----------|-------------------------------|-----------|----------|
| lat       | WGS84 standard latitude       | Number	| Yes      |
| lon       | WGS84 standard latitude       | Number	| Yes      |
| lang      | language used for the request | String	| No       |
| features  | Filter the response fields 	| String[]	| No       |
| metatdata | Include metadata in response  | Boolean   | No       |

## getHistoricalAirQuaility

Gets air quality data for a location at a single date and time or a date range.

### example single date and time
```javascript
const breezometer = require('node-breezometer');

const client = breezometer({ apiKey: 'my breezometer API key' });

// build my options
var options = {
	lat: 43.067475,
	lon:-89.392808,
	dateTime: new Date(Date.now() - 864000000)
};

// get the historical air quality for a dateTime
client.getHistoricalAirQuaility(options, function(err, body){
	if (err){
		console.log('derp! an error calling getHistoricalAirQuaility: ' + err);
	} else if (!body.data){
		// location does not have data
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
	lang: 'en',
	fields:['breezometer_aqi', 'country_aqi','pollutants'],
	startDate: new Date(Date.now() - 1728000000),
	endDate: new Date(Date.now() - 864000000),
	interval: 1
};

// get the historical air quality for a date range
client.getHistoricalAirQuaility(options function(err, body){
	if (err){
		console.log('derp! an error calling getHistoricalAirQuaility: ' + err);
	} else if (!body.data){
		// location does not have data
	} else {
		// the world is good! start processing the air quality reports
	}
});
```

### options
| Parameter | Description                                                      | Type   	| Required |
|-----------|------------------------------------------------------------------|------------|----------|
| lat       | WGS84 standard latitude                                          | Number 	| Yes      |
| lon       | WGS84 standard latitude                                          | Number 	| Yes      |
| lang      | language used for the request                                    | String   	| No       |
| features  | Filter the response fields 									   | String[]	| No       |
| dateTime  | ISO8601 date and time you want historical air quality for        | Date   	| No       |
| startDate | ISO8601 start date for a range of historical air quality results | Date   	| No       |
| endDate   | ISO8601 end date for a range of historical air quality results   | Date   	| No       |
| hours 	| Number of historical hourly forecasts to receive				   | Number   	| No       |
| metadata  | Include metadata in response 								 	   | Boolean    | No       |

## getForecast

Gets future forecast(s) for a location.

### example hours
```javascript
const breezometer = require('node-breezometer');

const client = breezometer({ apiKey: 'my breezometer API key' });

// build my options
var options = {
	lat: 43.067475,
	lon:-89.392808,
	lang: 'en',
	features:['breezometer_aqi', 'local_aqi','pollutants_aqi_information'],
	hours: 8
};

// get an hourly forecast for a location for the next 8 hours
client.getForecast(options function(err, body){
	if (err){
		console.log('derp! an error calling getForecast: ' + err);
	} else if (!body.data){
		// location does not have data
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
client.getForecast(options function(err, body){
	if (err){
		console.log('derp! an error calling getForecast: ' + err);
	} else if (!body.data){
		// location does not have data
	} else {
		// the world is good! start processing the hourly air quality forecasts
	}
});
```

### options
| Parameter | Description                                                                    | Type   	| Required |
|-----------|--------------------------------------------------------------------------------|----------|----------|
| lat       | WGS84 standard latitude                                                        | Number 	| Yes      |
| lon       | WGS84 standard latitude                                                        | Number 	| Yes      |
| lang      | language used for the request                                                  | String 	| No       |
| features  | Filter the response fields 									   				 | String[]	| No       |
| startDate | A specific start date range to get predictions for.,Can not be used with hours | Date   	| No       |
| endDate   | IA specific end date range to get predictions for.,Can not be used with hours  | Date   	| No       |
| hours     | Number of hourly forecasts to receive from now                                 | Number 	| No       |
| dateTime  | ISO8601 date and time you want forecasted air quality until        			 | Date   	| No       |
| metadata  | Include metadata in response 								 	   				 | Boolean  | No       |

## Pollen Features

1. Forecasts

## getDailyPollenForecast

Gets future daily pollen forecast(s) for a location.

### example

```javascript
const breezometer = require('node-breezometer');

const client = breezometer({ apiKey: 'my breezometer API key' });

// build my options
var options = {
	lat: 43.067475,
	lon:-89.392808,
	days: 3,
	features:['types_information', 'plants_information']
};

// get a daily forecast for a location for the next 3 days
client.getDailyPollenForecast(options, function(err, body) {
	if (err){
		console.log('derp! an error calling getDailyPollenForecast: ' + err);
	} else if (!body.data){
		// location does not have data
	} else {
		// the world is good! start processing the daily pollen forecasts
	}
});
```

### Options

| Parameter | Description                                                                    | Type   	| Required |
|-----------|--------------------------------------------------------------------------------|----------|----------|
| lat       | WGS84 standard latitude                                                        | Number 	| Yes      |
| lon       | WGS84 standard latitude                                                        | Number 	| Yes      |
| days | Number of days of forecast to receive | Number   	| Yes       |
| lang      | Language used for the request                                                  | String 	| No       |
| features  | Filter the response fields 									   				 | String[]	| No       |
| metadata  | Include metadata in response 								 	   				 | Boolean  | No       |

## Contributing

The more PRs the merrier. :-)

## Breezometer Association
node-breezometer npm package is not supported by Breezometer.