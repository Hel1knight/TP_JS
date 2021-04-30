require('@tensorflow/tfjs-node-gpu');
const cocoSsd = require('@tensorflow-models/coco-ssd');
const {bMap} = require('../functional-utils');
const R = require('ramda');
const Bromise = require('bluebird');

let model = undefined;

const loadModel = async () => {
  model = await cocoSsd.load();
  return Promise.resolve();
};

const detectObjects_ = async (img) => {
  if (!model) {
    process.exit();
  }

  return model.detect(img);
};

const detectFromImage_ = R.pipe(R.prop('image'), detectObjects_);

const detectObjectsInImages = R.pipe(
  R.map(R.converge(R.assoc('objectsDetected'), [detectFromImage_, R.identity])),
  bMap(Bromise.props)
);

module.exports = {detectObjectsInImages, loadModel};
