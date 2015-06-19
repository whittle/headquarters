'use strict';

var _ = require('lodash');

function mean(nums) {
  return _.sum(nums) / nums.length;
}

function mid(nums) {
  var div = Math.floor(nums.length / 2);
  var sorted = _.sortBy(nums);

  if (nums.length % 2 === 0) {
    return sorted.slice(div - 1, div + 1);
  } else {
    return sorted.slice(div, div + 1);
  }
}

var statistics = {
  max: _.max,
  mean: mean,
  median: _.compose(mean, mid),
  min: _.min,

  all: function(nums) {
    return {
      max: statistics.max(nums),
      mean: statistics.mean(nums),
      median: statistics.median(nums),
      min: statistics.min(nums)
    };
  }
};

module.exports = statistics;
