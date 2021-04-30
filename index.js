const R = require('ramda');
const {detectObjectsInImages, loadModel} = require('./app/ia-stuff/detect');
const {readDir, readJpegsFromList, moveImages} = require('./app/file-system');
const {classrecup} = require('./app/ia-stuff/recup-class');

const main = async (inputDir) => {
  await loadModel();

  const ret = await R.pipeWith(R.andThen, [
    readDir,
    R.map(R.concat(`./${inputDir}/`)),
    readJpegsFromList,
    detectObjectsInImages,
    classrecup,
    moveImages,
    R.tap(console.log)
  ])(inputDir);
};

main('dossier_parent');
