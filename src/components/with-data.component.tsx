import { useHydrateAtoms } from 'jotai/utils';
import React from 'react';
import { LogSeverity } from 'gvm-cex/dist/types';

import pkg from '../../package.json';
import type { AppSettings } from '../app-settings';
import { useLoadTickersWords } from '../hooks/use-load-tickers-words.hooks';
import { logsStorageAtom } from '../hooks/use-logs.hooks';
import { useSettingsSync } from '../hooks/use-settings-sync.hooks';
import { genId } from '../utils/id.utils';

export const WithDataComponent = ({
  children,
}: {
  children: (settings: AppSettings) => JSX.Element;
}) => {
  const { loaded: settingsLoaded, settings } = useSettingsSync();
  const { loaded: tickersLoaded } = useLoadTickersWords();

  useHydrateAtoms([
    [
      logsStorageAtom,
      [
        {
          id: genId(),
          timestamp: Date.now(),
          message: `tuleep.trade v${pkg.version} env:${process.env.STAGE}`,
          type: LogSeverity.Info,
        },
      ],
    ],
  ]);

  if (settingsLoaded && tickersLoaded) {
    return children(settings);
  }

  return <div />;
};
