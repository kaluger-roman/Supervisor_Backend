export type SuspisiousUnit = {
  word: string;
  weight: number; // 0-100
};

export type DictionarySynonyms = {
  wordlist: {
    name: string;
    synonyms: string[];
    similars: string[];
  }[];
};
