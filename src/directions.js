'use strict';

var _ = require('lodash');
var debug = require('debug')('headquarters:directions');
var request = require('request-promise');
var url = require('url');

var config = require('./config');

var directions = {
  // Curried function to turn a destination address (as a string) and
  // an origin address (both as strings) into a params hash suitable
  // for the Directions API.
  mkParams: function(dest) {
    return function(origin) {
      // TODO: include arrival_time
      return {
        origin: origin,
        destination: dest,
        mode: config.MODE,
        key: config.GOOGLE_PUBLIC_API_KEY
      };
    };
  },

  // Make a Google Directions API URL from an object with the
  // necessary params.
  mkUrl: function(paramsObj) {
    var baseUrl = _.clone(config.GOOGLE_DIRECTIONS_API_URL);
    return url.format(_.assign(baseUrl, {query: paramsObj}));
  },

  // Curried function to generate a promise to request the Google
  // Directions from the origin argument to the destination argument.
  mkRequest: function(dest) {
    return _.compose(request, directions.mkUrl, directions.mkParams(dest));
  },

  // Attempts to parse the given response as JSON, checks the status
  // member of the resulting object, and returns an appropriate
  // promise.
  handleResponse: function(resp) {
    var body = JSON.parse(resp);
    debug('status', body.status);

    if (body.status === 'OK') {
      return Promise.resolve(body.routes);
    } else {
      return Promise.reject(body.status);
    }
  },

  // Takes a Google Directions response that’s been parsed into an
  // object, and returns a total duration in seconds as a
  // number. Assumes that the response did not error.
  getDuration: function(routes) {
    // FIXME: Assumes that there’s exactly one route and that it has
    // exactly one leg.
    var duration = routes[0].legs[0].duration;
    debug('duration', duration.text);
    return duration.value;
  }
};

module.exports = directions;
