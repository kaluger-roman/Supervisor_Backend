import promisify = require('promisify-node');

const promisedFs = promisify('fs');

export const getCallSideChunkNames = async (
  recordPath: string,
  appenderSide: string,
) => {
  const files: string[] = await promisedFs.readdir(recordPath);

  return files
    .filter((name) => new RegExp(`^\\d+_${appenderSide}`).test(name))
    .sort((a, b) => parseInt(a) - parseInt(b));
};
