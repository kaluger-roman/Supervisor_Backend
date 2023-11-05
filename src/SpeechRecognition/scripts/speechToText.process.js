const {
  logLevel,
  loadModel,
  transcriptFromFile,
  freeModel,
} = require('@solyarisoftware/voskjs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const promisify = require('promisify-node');
const { existsSync } = require('fs');
const promisedFs = promisify('fs');
const nanoid = require('nanoid').nanoid;

const MODELS_DIR = path.resolve('sr_models', 'vosk-model-small-ru-0.22');
const FULL_MODELS_DIR = path.resolve('sr_models', 'vosk-model-ru-0.42');
const SR_REQUIRED_EXT = 'wav';
const BASIC_SAMPLE_RATE = 48000;

logLevel(-1);
const fluentModel = loadModel(MODELS_DIR);
const fullModel = loadModel(FULL_MODELS_DIR);

const speechToText = async ({ src, mode }) => {
  const model = mode === 'deep' ? fullModel : fluentModel;
  const tempFile = path.resolve('tmp', `${nanoid()}.${SR_REQUIRED_EXT}`);

  try {
    if (!existsSync(src)) {
      console.log('source not exist', src);
      return;
    }

    await promisedFs.writeFile(tempFile, '');

    await new Promise((resolve, reject) =>
      ffmpeg(src)
        .toFormat(SR_REQUIRED_EXT)
        .on('error', reject)
        .on('end', resolve)
        .save(tempFile),
    );

    const sampleRate = await new Promise((resolve) =>
      ffmpeg.ffprobe(tempFile, (_, data) =>
        resolve(data?.streams[0].sampleRate || BASIC_SAMPLE_RATE),
      ),
    );

    console.log('beforeprocess');
    const result = await transcriptFromFile(tempFile, model, {
      sampleRate,
    });
    await promisedFs.rm(tempFile);

    process.send(result);
    console.log('afterprocess');
  } catch (e) {
    console.log(e);
  }
};

process.on('message', async (message) => {
  speechToText(message);
});
