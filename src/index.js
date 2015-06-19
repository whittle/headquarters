'use strict';

var _ = require('lodash');
var argv = require('yargs').argv;
var request = require('request');
var url = require('url');

var config = require('./config');

function main() {
  var address = argv._.join(' ');
  var qs = _.map(config.LOCATIONS,
                 _.compose(mkUrl, mkParams(address), stringifyAddress));

  console.log(qs);
}

// Make a Google Directions API URL from an object with the necessary
// params.
function mkUrl(paramsObj) {
  var baseUrl = _.clone(config.GOOGLE_DIRECTIONS_API_URL);
  return url.format(_.assign(baseUrl, {query: paramsObj}));
}

// Curried function to turn a destination address (as a string) and an
// origin address (both as strings) into a params hash suitable for the
// Directions API.
function mkParams(dest) {
  return function(origin) {
    // TODO: include arrival_time
    return {
      origin: origin,
      destination: dest,
      mode: config.MODE,
      key: config.GOOGLE_PUBLIC_API_KEY
    };
  };
}

// Just turn an object from the locations file into a string.
function stringifyAddress(address) {
  return [address.street,
          address.city + ',',
          address.state,
          address.zip].join(' ');
}

main();
