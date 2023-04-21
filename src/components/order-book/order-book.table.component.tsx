import { useAtomValue } from 'jotai';
import React from 'react';

import {
  orderBookAtom,
  orderBookPrecisionAtom,
} from '../../atoms/orderbook.atoms';

import { OrderBookSideComponent } from './order-book.side.component';

export const OrderBookTableComponent = ({ rows }: { rows: number }) => {
  const orderBook = useAtomValue(orderBookAtom);
  const precision = useAtomValue(orderBookPrecisionAtom);

  const bids = orderBook.bids.filter((_, idx) => idx < rows);
  const asks = orderBook.asks.filter((_, idx) => idx < rows);

  const max = Math.max(
    ...bids.map((o) => o.total),
    ...asks.map((o) => o.total)
  );

  return (
    <div className="flex relative">
      <div className="absolute text-dark-text-gray font-mono text-xs font-bold uppercase left-1/2 -translate-x-1/2 top-2">
        TOTAL
      </div>
      <div className="w-1/2">
        <OrderBookSideComponent
          side="bids"
          orders={bids}
          precision={precision}
          max={max}
        />
      </div>
      <div className="w-1/2">
        <OrderBookSideComponent
          side="asks"
          orders={asks}
          precision={precision}
          max={max}
        />
      </div>
    </div>
  );
};
