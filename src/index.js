'use strict';

var _ = require('lodash');
var argv = require('yargs').argv;
var debug = require('debug')('headquarters');
var moment = require('moment');
var Promise = require('bluebird');

var config = require('./config');
var directions = require('./directions');
var statistics = require('./statistics');

function main() {
  var destination = argv._.join(' ');
  var arrival = nextWednesdayAtTen();

  var mkRequest = _.compose(directions.mkRequest(destination, arrival),
                            stringifyAddress);
  var requests = _.map(config.LOCATIONS, mkRequest);

  var durations = Promise.map(requests, function(resp) {
    return directions.handleResponse(resp)
      .then(directions.getDuration);
  });

  durations.then(function(ds) {
    var output = formatStats(statistics.all(ds)).join('\n') + '\n';
    process.stdout.write(output);
  }).catch(function(err) {
    debug('Error!', err);
    process.exit(1);
  });
}

// Returns the seconds since midnight, 1Jan1970 UTC for 10:00a local
// time on Wednesday of next week.
function nextWednesdayAtTen() {
  var now = moment();

  return moment({
    year: now.year(),
    hour: 10})
    .week(now.week() + 1)
    .day('Wednesday')
    .unix();
}

// Just turn an object from the locations file into a string.
function stringifyAddress(address) {
  return [address.street,
          address.city + ',',
          address.state,
          address.zip].join(' ');
}

// Turn the stats object returned by statistics.all into an array of
// strings ready to be output.
function formatStats(stats) {
  var maxKeyLength = _(stats).keys().map(_.property('length')).max();

  return _.map(stats, function(val, key) {
    var label = _.padLeft(_.capitalize(key), maxKeyLength);
    return [label, formatSeconds(val)].join(': ');
  });
}

// Turn a number representing a duration in seconds into a formatted
// string representing the same.
function formatSeconds(seconds) {
  return moment.duration(seconds, 'seconds').humanize();
}

main();
