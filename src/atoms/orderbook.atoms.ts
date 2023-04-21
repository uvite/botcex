import { atom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import type { OrderBook, OrderBookOrders } from 'gvm-cex/dist/types';
import { calcOrderBookTotal } from 'gvm-cex/dist/utils/orderbook';
import { add, multiply } from 'gvm-cex/dist/utils/safe-math';

import { appSettingsAtom } from '../app-settings';
import { selectedMarketAtom } from '../app-state';

const precisionGroup = (precision: number, orders: OrderBookOrders[]) => {
  return orders.reduce<OrderBookOrders[]>((acc, o) => {
    const price = Math.floor(o.price / precision) * precision;
    const existing = acc.find((o2) => o2.price === price);

    if (existing) {
      existing.amount = add(existing.amount, o.amount);
      existing.total = o.total;
    } else {
      acc.push({ ...o, price });
    }

    return acc;
  }, []);
};

const toDollars = (orderBook: OrderBook) => {
  orderBook.bids.forEach((b) => {
    // eslint-disable-next-line no-param-reassign
    b.amount = Math.round(multiply(b.amount, b.price) * 100) / 100;
  });
  orderBook.asks.forEach((a) => {
    // eslint-disable-next-line no-param-reassign
    a.amount = Math.round(multiply(a.amount, a.price) * 100) / 100;
  });
};

export const orderBookDisplayDollarAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('orderBook').prop('displayDollar')
);

export const orderBookPrecisitionOptionIdxAtom = focusAtom(
  appSettingsAtom,
  (o) => o.prop('orderBook').prop('precisionOptionIdx')
);

export const orderBookPrecisionOptionsAtom = atom((get) => {
  const market = get(selectedMarketAtom);
  const pPrice = market?.precision?.price ?? 0.01;

  const baseArray = [1, 2, 3, 5];
  const result: Array<{ value: number; label: number }> = [];

  for (let i = 0; i < 2; i++) {
    for (const base of baseArray) {
      const value = multiply(multiply(base, pPrice), 10 ** i);
      result.push({ value, label: value });
    }
  }

  return result;
});

export const orderBookPrecisionAtom = atom((get) => {
  const options = get(orderBookPrecisionOptionsAtom);
  const idx = get(orderBookPrecisitionOptionIdxAtom);
  const option = options[idx] || options[3];
  return option.value;
});

const _orderBookAtom = atom<OrderBook>({
  asks: [],
  bids: [],
});

export const orderBookAtom = atom(
  (get) => {
    const precision = get(orderBookPrecisionAtom);
    const orderBook = get(_orderBookAtom);
    const dollar = get(orderBookDisplayDollarAtom);

    const data = {
      asks: precisionGroup(precision, orderBook.asks),
      bids: precisionGroup(precision, orderBook.bids),
    };

    if (dollar) {
      toDollars(data);
      calcOrderBookTotal(data);
    }

    return data;
  },
  (_get, set, value: OrderBook) => {
    set(_orderBookAtom, value);
  }
);
