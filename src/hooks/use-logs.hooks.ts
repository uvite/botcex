import { atom } from 'jotai';

import { genId } from '../utils/id.utils';

export enum LogSeverity {
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
}

export interface Log {
  id: string;
  message: string;
  timestamp: number;
  type: LogSeverity;
}

export const logsStorageAtom = atom<Log[]>([]);

export const logsAtom = atom(
  (get) => get(logsStorageAtom).slice().reverse(),
  (_get, set, message: string, type: LogSeverity = LogSeverity.Info) =>
    set(logsStorageAtom, (logs) =>
      logs.concat({ id: genId(), message, timestamp: Date.now(), type })
    )
);

export const clearLogsAtom = atom(null, (_get, set) =>
  set(logsStorageAtom, [])
);
