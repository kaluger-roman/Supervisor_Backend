export enum SRMode {
  fluent = 'fluent',
  deep = 'deep',
}

export type SRTask = {
  src: string;
  mode: SRMode;
  callback: (recognized: SRResult) => void;
};

export type SRResult = {
  result: object[];
  text: string;
};

export type SROutput = SRResult & {
  id: string;
};
