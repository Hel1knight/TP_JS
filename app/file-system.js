const R = require('ramda');
const Bromise = require('bluebird');
const jpeg = require('jpeg-js');
const fs = require('fs-extra');
const {bMap} = require('./functional-utils');

const readJpg_ = async (path) => jpeg.decode(await fs.readFile(path), true);

const readJpegsFromList = bMap(
  R.pipe(
    R.applySpec({
      path: R.identity,
      image: readJpg_ //les données de l'image
    }),
    Bromise.props
  )
);

const readDir = fs.readdir;

const ensureOutputPath_ = (x) =>
  R.pipe(
    R.prop('outputPath'),
    R.unary(fs.ensureDir),
    R.andThen(R.always(x))
  )(x);

const createOutputPath_ = R.pipe(
  R.prop('objectsDetected'),
  R.head,
  R.concat('./output/')
);

const prepareOutputRoot_ = R.pipe(R.prop('outputPath'), R.flip(R.concat)('/'));

const extractFileName_ = R.pipe(R.prop('path'), R.split('/'), R.last);

const buildOutputPath_ = R.converge(R.concat, [
  prepareOutputRoot_,
  extractFileName_
]);

const moveImage_ = R.pipe(
  R.converge(R.assoc('outputPath'), [createOutputPath_, R.identity]),
  ensureOutputPath_,
  R.andThen(R.converge(R.assoc('outputPath'), [buildOutputPath_, R.identity])),
  R.andThen(R.tap(R.converge(fs.move, [R.prop('path'), R.prop('outputPath')])))
);

const moveImages = bMap(moveImage_);

module.exports = {readJpegsFromList, readDir, moveImages};
