var adhan = require('adhan');
var request = require('request');
var fs = require('fs');
var path = require('path');
var lame = require('lame');
var Speaker = require('speaker');

// Change these constants to adjust how prayer times are calculated
const CALCULATION_METHOD = adhan.CalculationMethod.NorthAmerica();
const MADHAB = adhan.Madhab.Shafi;
const HIGH_LATITUDE_RULE = adhan.HighLatitudeRule.MiddleOfTheNight;
const LOCATION_FILE = path.join(__dirname, 'location.txt');

// Return whether or not two date objects occur at the same hour and minute
function sameTime(d1, d2) {
	return (
		d1.getHours() === d2.getHours() &&
		d1.getMinutes() === d2.getMinutes()
	);
}

// Accept a sound file's filename as input and play it
function playAthan(filename) {
	fs.createReadStream(filename)
	  .pipe(new lame.Decoder())
	  .on('format', function (format) {
		this.pipe(new Speaker(format));
	  });
}

// Calculate prayer times and determine whether or not to play adhan
callback = function(lat, long) {
	var coordinates = new adhan.Coordinates(lat, long);
	var date = new Date();
	var params = CALCULATION_METHOD;
	params.madhab = MADHAB;
	params.highLatitudeRule = HIGH_LATITUDE_RULE;
	var prayerTimes = new adhan.PrayerTimes(coordinates, date, params);
	var now = new Date();

	if (sameTime(prayerTimes.fajr, now)) {
		playAthan(path.join(__dirname, '.') +
			'/Makkah Fajr Adhan Sheikh Ali Mullah.mp3');
	} else if (sameTime(prayerTimes.dhuhr, now) ||
			   sameTime(prayerTimes.asr, now) ||
			   sameTime(prayerTimes.maghrib, now) ||
			   sameTime(prayerTimes.isha, now)) {
		playAthan(path.join(__dirname, '.') + '/Adhan Makkah.mp3')
	}
}

// Figure out latitude and longitude coordinates for the current location
function getLocation(callback) {
	request('http://ip-api.com/json', function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var parsed = JSON.parse(body);
			locationStr = parsed.lat.toString() + '\n' + parsed.lon.toString();
			// Save the current coordinates to a file to be used in case the api
			// goes down or the device running this script loses its internet
			// connection
			fs.writeFile(LOCATION_FILE, locationStr, (err) => {
				if (err) throw err;
			});
			callback(parsed.lat, parsed.lon);
		} else {
			// Use saved coordinates as current location
			fs.readFile(LOCATION_FILE, 'utf8', (err, data) => {
				if (err) {
					// Absolute fallback location is the Kaaba
					callback(21.4225289, 39.8239929);
				} else {
					lat = parseFloat(data.split('\n')[0]);
					lon = parseFloat(data.split('\n')[1]);
					callback(lat, lon);
				}
			});
		}
	});
}

getLocation(callback);
