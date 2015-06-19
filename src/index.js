'use strict';

var _ = require('lodash');
var argv = require('yargs').argv;
var debug = require('debug')('headquarters');
var Promise = require('bluebird');
var request = require('request-promise');
var url = require('url');

var config = require('./config');

function main() {
  var address = argv._.join(' ');
  var requests = _.map(config.LOCATIONS,
                       _.compose(request,
                                 mkUrl,
                                 mkParams(address),
                                 stringifyAddress));
  var durations = Promise.map(requests, function(resp) {
    var body = JSON.parse(resp);
    debug('Status', body.status);
    return getDuration(body);
  }).then(function(ds) {
    console.log(ds);
  });
}

// Takes a Google Directions response that’s been parsed into an
// object, and returns a total duration in seconds as a
// number. Assumes that the response did not error.
function getDuration(respBody) {
  // FIXME: Assumes that there’s exactly one route and that it has
  // exactly one leg.
  var duration = respBody.routes[0].legs[0].duration;
  debug('Duration', duration.text);
  return duration.value;
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
