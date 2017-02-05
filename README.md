# Adhan clock

This repo includes the code and instructions for setting up your own adhan clock on any computer or microcomputer that supports node.js. In my case, my adhan clock is installed on a raspberry pi in my apartment.

## Installation

After cloning this repository or downloading and extracting its files, run `npm install` to install its dependencies.

## Setup

Once all the parts of the project are installed, create a cron job to run the `app.js` script once per minute using node. First run `crontab -e`, and then at the bottom of the opened file add a line simlar to the example below, using the path to your installed copy of the adhan clock.

```
*/1 * * * * node path-to-project/adhan-clock/app.js
```

If the device you are using to host the adhan clock does not have built-in speakers, make sure you connect a pair of speakers to the device.

## Cusomization

By default, the adhan clock uses the North America calculation method, the Shafi Asr time, and the Middle of the Night high latitude rule. These settings are set as constants at the top of `app.js` and can be changed. For a list and explanation of each of these paramters and their alternative settings, take a look at the [Adhan](https://github.com/batoulapps/Adhan/tree/master/JavaScript) library which this project uses for prayer time calculations.

## FAQ

### How does the adhan clock get its location?

The adhan clock uses a free api provided by [ip-api.com](http://ip-api.com/) to find its location using its internet connection. If the adhan clock has never operated while having an internet connection, it uses the location of the Kaaba. When the adhan clock runs and succesfully uses its internet connection to obtain a location, it saves that location to disk, and so if the adhan clock loses its internet connection later on it will continue to operate based on its last known location.

### How does the adhan clock get prayer times?

The adhan clock calculates prayer times using the [Adhan](https://github.com/batoulapps/Adhan/tree/master/JavaScript) JavaScript library.

## License

Adhan clock is available under the MIT license. See the LICENSE file for more info.
