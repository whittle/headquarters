'use strict';

var _ = require('lodash');
var argv = require('yargs').argv;
var debug = require('debug')('headquarters');
var Promise = require('bluebird');

var config = require('./config');
var directions = require('./directions');
var statistics = require('./statistics');

function main() {
  var destination = argv._.join(' ');

  var mkRequest = _.compose(directions.mkRequest(destination),
                            stringifyAddress);
  var requests = _.map(config.LOCATIONS, mkRequest);

  var durations = Promise.map(requests, function(resp) {
    return directions.handleResponse(resp)
      .then(directions.getDuration);
  });

  durations.then(function(ds) {
    console.log(statistics.all(ds));
  }).catch(function(err) {
    debug('Error!', err);
    process.exit(1);
  });
}

// Just turn an object from the locations file into a string.
function stringifyAddress(address) {
  return [address.street,
          address.city + ',',
          address.state,
          address.zip].join(' ');
}

main();
