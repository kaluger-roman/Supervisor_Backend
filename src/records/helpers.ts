import promisify = require('promisify-node');
import { CallSide } from 'src/calls/types';
import { SRMode } from 'src/SpeechRecognition/types';
import { AppenderSide } from './types';

const promisedFs = promisify('fs');

export const getCallSideChunkNames = async (
  recordPath: string,
  side: CallSide,
) => {
  const files: string[] = await promisedFs.readdir(recordPath);

  return files
    .filter((name) =>
      new RegExp(`^\\d+_${buildAppenderSideName(side)}`).test(name),
    )
    .sort((a, b) => parseInt(a) - parseInt(b));
};

export const buildTranscriptionFiledName = (side: CallSide, mode: SRMode) =>
  `transcription${side}${mode === SRMode.fluent ? 'Fluent' : ''}`;

export const buildTranscriptionForeignId = (side: CallSide, mode: SRMode) =>
  `${buildTranscriptionFiledName(side, mode)}Id`;

export const buildAppenderSideName = (side: CallSide) =>
  `src${side}` as AppenderSide;
