import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import { marketsAtom } from '../../app-state';
import { setMessageHistoryAtom } from '../../atoms/app.atoms';
import { formatNews } from '../../utils/format-news.utils';
import { genId } from '../../utils/id.utils';
import { matchTickersAtom } from '../../utils/ticker-match/ticker-match.atoms';
import {
  newsBlocklistAtom,
  treeNewsKeyAtom,
} from '../trade/use-news-trade.hooks';
import { logsAtom, LogSeverity } from '../use-logs.hooks';
import { useSupabase } from '../use-supabase.hooks';

import { isBlocked } from './news.utils';
import { useHandleMessage } from './use-handle-message.hooks';
import type { News, NewsWithSymbols } from './use-news.types';

const useMadnewsHistory = () => {
  const isLoading = useRef(false);
  const [loaded, setLoaded] = useState(false);

  const supabase = useSupabase();

  const blocklist = useAtomValue(newsBlocklistAtom);
  const markets = useAtomValue(marketsAtom);

  const matchTickers = useAtomValue(matchTickersAtom);
  const setMessageHistory = useSetAtom(setMessageHistoryAtom);

  useEffect(() => {
    if (!loaded && !isLoading.current && markets.length) {
      isLoading.current = true;
      supabase
        .from('madnews')
        .select()
        .order('created_at', { ascending: false })
        .limit(50)
        .then(({ data }) => {
          const messages = data?.map((d) => d.message as unknown as News) || [];
          const news = messages.reduce<NewsWithSymbols[]>((acc, n: News) => {
            if (isBlocked(blocklist, n)) return acc;

            if (n.title) {
              const formatted = formatNews(n);
              const symbols = matchTickers(n);
              return [...acc, { id: genId(), news: formatted, symbols }];
            }

            return acc;
          }, []);

          setMessageHistory(news);
          setLoaded(true);
          isLoading.current = false;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markets, loaded]);

  return loaded;
};

const useMadnewsWebsocket = () => {
  const log = useSetAtom(logsAtom);
  const apiKey = useAtomValue(treeNewsKeyAtom);
  const handleMessage = useHandleMessage();

  const { lastMessage, sendMessage, readyState } = useWebSocket(
    `wss://news.treeofalpha.com/ws`,
    {
      shouldReconnect: () => true,
      onMessage: () => log('[TREENEWS] Received new message'),
      onOpen: () => log('[TREENEWS] Connected to data stream'),
      onClose: () => {
        log('[TREENEWS] Disconnected from data stream', LogSeverity.Warning);
      },
    }
  );

  useEffect(() => {
    if (readyState === WebSocket.OPEN && apiKey && apiKey.length === 64) {
      sendMessage(`login ${apiKey}`);
    }
  }, [readyState, sendMessage, apiKey]);

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data);

      if ('_id' in message && 'title' in message && 'time' in message) {
        handleMessage(message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);
};

export const useMadnews = () => {
  useMadnewsWebsocket();
  const loaded = useMadnewsHistory();
  return loaded;
};
