const R = require('ramda');

const classrecup = R.map(R.over(R.lensProp('objectsDetected'), R.pluck('class')));

module.exports = {classrecup};
