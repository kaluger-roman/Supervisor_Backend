import { TranscriptionUnit } from '../../SpeechRecognition/types';
import { spawn } from 'child_process';
import * as dict from './dictionary.json';
import { DictionarySynonyms } from './types';
import { BASE_SUSPISIOUS_WORDS } from './constants';

class AnaliticsService {
  async lemmatizeTranscriptions(transcriptions: TranscriptionUnit[]) {
    const pythonProcess = spawn('python3', [
      'src/records/analitics/make-lemmas.py',
      JSON.stringify(transcriptions.map((x) => x.word)),
    ]);

    return new Promise((resolve) => {
      pythonProcess.stdout.on('data', (data) => {
        const convertedData = JSON.parse(data.toString());
        const result = transcriptions.map((x, inx) => ({
          ...x,
          word: convertedData[inx],
        }));

        resolve(result);
      });
    });
  }
  async fixSpell(transcriptions: TranscriptionUnit[]) {
    const pythonProcess = spawn('python3', [
      'src/records/analitics/spellCorrect.py',
      JSON.stringify(transcriptions.map((x) => x.word)),
    ]);

    return new Promise((resolve) => {
      pythonProcess.stderr.on('data', (data) => {
        const convertedData = data.toString();

        resolve(convertedData);
      });

      pythonProcess.stdout.on('data', (data) => {
        const convertedData = JSON.parse(data.toString());
        const result = transcriptions.map((x, inx) => ({
          ...x,
          word: convertedData[inx],
        }));

        resolve(result);
      });
    });
  }
  calcSynonymRatingForWord(text: string) {
    const dictWord = (dict as DictionarySynonyms).wordlist.find(
      (x) => x.name === text,
    );

    if (!dictWord) return 0;

    const suspeciousRoot = BASE_SUSPISIOUS_WORDS.find(
      ({ word }) =>
        word === text ||
        dictWord.synonyms?.includes(word) ||
        dictWord.similars?.includes(word),
    );

    if (suspeciousRoot) return suspeciousRoot.weight;

    return 0;
  }
  async evaluateSynonymRatingSuspicion(transcriptions: TranscriptionUnit[]) {
    const spelled = (await this.fixSpell(
      transcriptions,
    )) as TranscriptionUnit[];

    const lemmas = (await this.lemmatizeTranscriptions(
      spelled,
    )) as TranscriptionUnit[];

    return lemmas.map((x) => ({
      ...x,
      suspicion: this.calcSynonymRatingForWord(x.word),
    }));
  }
  async evaluateW2VRatingSuspicion(transcriptions: TranscriptionUnit[]) {
    const spelled = (await this.fixSpell(
      transcriptions,
    )) as TranscriptionUnit[];
    const lemmas = (await this.lemmatizeTranscriptions(
      spelled,
    )) as TranscriptionUnit[];
    const pythonProcess = spawn('python3', [
      'src/records/analitics/wordToVec.py',
      JSON.stringify(lemmas.map((x) => x.word)),
    ]);

    return await new Promise((resolve) => {
      pythonProcess.stdout.on('data', (data) => {
        const convertedData = JSON.parse(data.toString());
        const result = convertedData.map((similars, inx) => ({
          ...transcriptions[inx],
          suspicion:
            BASE_SUSPISIOUS_WORDS.find((s) =>
              (similars as [string, number][]).some(
                (x) =>
                  (x[0] === s.word && x[1] > 0.5) ||
                  (x[0] === lemmas[inx].word && x[1] > 0.5) ||
                  (x[0] === transcriptions[inx].word && x[1] > 0.5) ||
                  s.word === lemmas[inx].word ||
                  s.word === transcriptions[inx].word,
              ),
            )?.weight || 0,
        }));

        resolve(result);
      });
    });
  }

  async evaluateBERTRatingSuspicion(
    transcriptions: TranscriptionUnit[],
  ): Promise<any> {
    const pythonProcess = spawn('python3', [
      'src/records/analitics/bert/calc.py',
      JSON.stringify(transcriptions.map((x) => x.word).join(' ')),
    ]);
    //надо закидывать фразы наверное целые, подумать
    return await new Promise((resolve) => {
      pythonProcess.stderr.on('data', (data) => {
        const result = data.toString();

        console.log(result);
      });

      pythonProcess.stdout.on('data', (data) => {
        const result = JSON.parse(data.toString())[0];

        resolve(result);
      });
    });
  }
}

export const analiticsService = new AnaliticsService();
