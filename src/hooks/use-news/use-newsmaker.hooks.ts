import type { RealtimeChannel } from '@supabase/supabase-js';
import { useAtomValue, useSetAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import { marketsAtom } from '../../app-state';
import { setMessageHistoryAtom } from '../../atoms/app.atoms';
import { formatNews } from '../../utils/format-news.utils';
import { matchTickersAtom } from '../../utils/ticker-match/ticker-match.atoms';
import { newsBlocklistAtom } from '../trade/use-news-trade.hooks';
import { useSupabase } from '../use-supabase.hooks';

import { isBlocked } from './news.utils';
import { useHandleMessage } from './use-handle-message.hooks';
import type { NewsWithSymbols, TGNews } from './use-news.types';

const transformMessage = (record: Record<string, any>) => {
  return {
    id: record.id.toString(),
    title: 'Newsmaker.Pro',
    source: 'Newsmaker.Pro',
    body: (record.message as any).message,
    time: (record.message as any).time * 1000,
    link: 'https://t.me/s/nwsmkr',
  };
};

const useNewsmakerHistory = () => {
  const isLoading = useRef(false);
  const [loaded, setLoaded] = useState(false);

  const supabase = useSupabase();

  const blocklist = useAtomValue(newsBlocklistAtom);
  const markets = useAtomValue(marketsAtom);

  const matchTickers = useAtomValue(matchTickersAtom);
  const setMessageHistory = useSetAtom(setMessageHistoryAtom);

  useEffect(() => {
    if (!loaded && !isLoading.current && markets.length) {
      supabase
        .from('newsmaker')
        .select()
        .order('created_at', { ascending: false })
        .limit(50)
        .then((response) => {
          const data = response.data || [];
          const asMadnewsFormat: TGNews[] = data
            .filter((d) => d.message && (d.message as any).message)
            .map((d) => transformMessage(d));

          const news = asMadnewsFormat.reduce<NewsWithSymbols[]>((acc, n) => {
            if (isBlocked(blocklist, n)) return acc;

            if (n.title) {
              const formatted = formatNews(n);
              const symbols = matchTickers(n);
              return [...acc, { id: n.id, news: formatted, symbols }];
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

const useNewsmakerWebsocket = () => {
  const { data: session } = useSession();

  const supabase = useSupabase();
  const handleMessage = useHandleMessage();
  const [lastMessage, setLastMessage] = useState<TGNews | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    if (session) {
      channel = supabase
        .channel('newsmaker-live')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'newsmaker',
          },
          ({ new: data }) => {
            setLastMessage(transformMessage(data));
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabase, session]);

  useEffect(() => {
    if (lastMessage !== null) {
      handleMessage(lastMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);
};

export const useNewsmaker = () => {
  useNewsmakerWebsocket();
  const loaded = useNewsmakerHistory();
  return loaded;
};
