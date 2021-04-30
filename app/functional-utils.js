const Bromise = require('bluebird');
const R = require('ramda');

const bMap = R.curry((fn, list) => Bromise.map(list, fn));

module.exports = {bMap};
