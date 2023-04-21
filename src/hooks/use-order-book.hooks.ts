import { useAtomValue, useSetAtom } from 'jotai';
import { throttle } from 'lodash';
import { useContext, useEffect, useMemo } from 'react';
import type { OrderBook } from 'gvm-cex/dist/types';
import { clone } from 'gvm-cex/dist/utils/clone';

import { orderBookAtom } from '../atoms/orderbook.atoms';
import { selectedSymbolAtom } from '../atoms/trade.atoms';

import { ConnectorContext } from './use-exchange-connector.hooks';

export const useOrderBook = () => {
  const symbol = useAtomValue(selectedSymbolAtom);
  const exchange = useContext(ConnectorContext);
  const setOrderBook = useSetAtom(orderBookAtom);

  const trottledSetOrderBook = useMemo(
    () => throttle((d) => setOrderBook(clone(d)), 100, { trailing: true }),
    [setOrderBook]
  );

  useEffect(() => {
    let dispose: () => void;

    if (symbol && exchange) {
      dispose = exchange.listenOrderBook(symbol, (data: OrderBook) => {
        trottledSetOrderBook(data);
      });
    }

    return () => {
      trottledSetOrderBook.cancel();
      trottledSetOrderBook({ asks: [], bids: [] });
      dispose?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, exchange]);
};
