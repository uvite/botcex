import { atom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { defaultStore } from 'gvm-cex/dist/store/store.base';
import type { StoreData } from 'gvm-cex/dist/types';
import { clone } from 'gvm-cex/dist/utils/clone';

import { selectedSymbolAtom } from './atoms/trade.atoms';

export const appState: StoreData = clone(defaultStore);

export const appStateAtom = atom({ ...appState });
export const loadedAtom = focusAtom(appStateAtom, (o) => o.prop('loaded'));
export const latencyAtom = focusAtom(appStateAtom, (o) => o.prop('latency'));
export const balanceAtom = focusAtom(appStateAtom, (o) => o.prop('balance'));
export const tickersAtom = focusAtom(appStateAtom, (o) => o.prop('tickers'));
export const marketsAtom = focusAtom(appStateAtom, (o) => o.prop('markets'));
export const ordersAtom = focusAtom(appStateAtom, (o) => o.prop('orders'));
export const optionsAtom = focusAtom(appStateAtom, (o) => o.prop('options'));
export const positionsAtom = focusAtom(appStateAtom, (o) =>
  o.prop('positions')
);

export const selectedMarketAtom = atom((get) => {
  const selected = get(selectedSymbolAtom);
  const markets = get(marketsAtom);
  return markets.find((m) => m.symbol === selected);
});

export const selectedTickerAtom = atom((get) => {
  const selected = get(selectedSymbolAtom);
  const tickers = get(tickersAtom);
  return tickers.find((t) => t.symbol === selected);
});

export const selectedPositionsAtom = atom((get) => {
  const selected = get(selectedSymbolAtom);
  const positions = get(positionsAtom);
  return positions.filter((p) => p.symbol === selected);
});

export const selectedOrdersAtom = atom((get) => {
  const selected = get(selectedSymbolAtom);
  const orders = get(ordersAtom);
  return orders.filter((o) => o.symbol === selected);
});
