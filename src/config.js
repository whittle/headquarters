'use strict';

var fs = require('fs');
var url = require('url');

var config = {
  GOOGLE_DIRECTIONS_API_URL: url.parse(process.env.GOOGLE_DIRECTIONS_API_URL ||
                                       'https://maps.googleapis.com/maps/api/directions/json'),
  GOOGLE_PUBLIC_API_KEY: process.env.GOOGLE_PUBLIC_API_KEY,
  LOCATIONS: JSON.parse(fs.readFileSync('./locations.json')),
  MODE: process.env.MODE || 'transit'
};

module.exports = config;
