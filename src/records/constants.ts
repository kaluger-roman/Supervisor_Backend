import * as path from 'path';
import { Call } from 'src/calls/calls.model';
import { User } from 'src/users/users.model';
import { SortedFieldsRecordFilters } from './types';

export const RECORD_FILE_PREFIX = 'call_record_';
export const RECORDS_FILE_PATH = path.resolve('recordsStorage');
export const TARGET_EXT = 'mp3';
export const CHUNK_DURATION = 7000;
export const PROCESS_TOTAL_OFFSET = 1000;

export const SortKeyToFields = {
  [SortedFieldsRecordFilters.calleeName]: [
    { model: Call, as: 'call' },
    { model: User, as: 'callee' },
    'username',
  ],
  [SortedFieldsRecordFilters.callerName]: [
    { model: Call, as: 'call' },
    { model: User, as: 'caller' },
    'username',
  ],
  [SortedFieldsRecordFilters.id]: ['id'],
  [SortedFieldsRecordFilters.start]: [
    { model: Call, as: 'call' },
    'startTimestamp',
  ],
  [SortedFieldsRecordFilters.duration]: ['duration'],
};
