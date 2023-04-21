import { useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';

import {
  tickersWordsCommonAtom,
  tickersWordsMappingAtom,
} from '../utils/ticker-match/ticker-match.atoms';

import { useSupabase } from './use-supabase.hooks';

export const useLoadTickersWords = () => {
  const isLoading = useRef(false);

  const [loadedA, setLoadedA] = useState<boolean>(false);
  const [loadedB, setLoadedB] = useState<boolean>(false);

  const supabase = useSupabase();
  const setTickersWordsCommon = useSetAtom(tickersWordsCommonAtom);
  const setTickersWordsMapping = useSetAtom(tickersWordsMappingAtom);

  useEffect(() => {
    if (!isLoading.current) {
      isLoading.current = true;
      supabase
        .from('tickers_words_mapping')
        .select('word, tickers')
        .then(({ data }) => {
          const tickersWordsMapping = Object.fromEntries(
            data?.map((item) => [item.word, item.tickers]) || []
          );
          setTickersWordsMapping(tickersWordsMapping);
          setLoadedA(true);
        });

      supabase
        .from('tickers_words_common')
        .select('word')
        .then(({ data }) => {
          const tickersWordsCommon = data?.map((item) => item.word) || [];
          setTickersWordsCommon(tickersWordsCommon);
          setLoadedB(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loaded: loadedA && loadedB };
};
