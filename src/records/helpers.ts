import promisify = require('promisify-node');
import { CallSide } from 'src/calls/types';
import { SRMode, TranscriptionUnit } from 'src/SpeechRecognition/types';
import { AppenderSide } from './types';
import * as ffmpeg from 'fluent-ffmpeg';
import { pick } from 'lodash';

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

export const getDuration = async (src: string): Promise<number> =>
  new Promise<number>((resolve) => {
    ffmpeg.ffprobe(src, (_, data) =>
      resolve(isFinite(data.format.duration) ? data.format.duration : 0),
    );
  });

export const pickTranscriptFields = (val: TranscriptionUnit) =>
  pick(val, ['conf', 'end', 'id', 'start', 'word']);
