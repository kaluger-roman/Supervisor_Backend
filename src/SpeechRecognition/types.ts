export enum SRMode {
  fluent = 'fluent',
  deep = 'deep',
}

export type SRTask = {
  src: string;
  mode: SRMode;
  callback: (recognized: SRResult) => void;
};

export type TranscriptionUnit = {
  conf: number;
  end: number;
  start: number;
  word: string;
  id: number;
  crimeMeaningSynonymRate: number;
  crimeMeaningW2VRate: number;
};

export type SRResult = {
  result: TranscriptionUnit[];
  text: string;
};

export type SROutput = SRResult & {
  id: string;
};
