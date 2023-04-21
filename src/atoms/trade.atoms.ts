import { atom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { adjust } from 'gvm-cex/dist/utils/safe-math';

import { appSettingsAtom } from '../app-settings';
import { selectedMarketAtom } from '../app-state';
import { simpleTradeEntryAtom } from '../hooks/trade/use-simple-orders-trade.hooks';
import { selectedSymbolSidePriceAtom } from '../hooks/use-ticker-price.hooks';
import { pFloat } from '../utils/parse-float.utils';

// Not synced to backend
// ---------------------
export enum LastTouchedInput {
  Entry = 'entry',
  From = 'from',
  StopLoss = 'stopLoss',
  TakeProfit = 'takeProfit',
  To = 'to',
}

export const tradeLastTouchedAtom = atom<LastTouchedInput | null>(null);
export const tradeEntryTouchedAtom = atom(false);

export const tradeSizeAtom = atom('');
export const tradeSizeUSDAtom = atom('');

export const tradeFromAtom = atom('');
export const tradeToAtom = atom('');
export const tradeStopLossAtom = atom('');
export const tradeTakeProfitAtom = atom('');
export const tradeReduceOnlyAtom = atom(false);

// Computed from preferences and state
// -----------------------------------
export const tradeEntryOrCurrentPriceAtom = atom((get) => {
  const entry = get(tradeFromAtom);
  const entryTouched = get(tradeEntryTouchedAtom);
  const symbolPrice = get(selectedSymbolSidePriceAtom);

  return entryTouched ? entry : symbolPrice;
});

// Saved preferences
// -----------------
export const selectedSymbolAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('trading').prop('selectedSymbol')
);

export const tradeSideAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('trading').prop('side')
);

export const nbOrdersAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('trading').prop('scaledOrdersCount')
);

export const selectedTradeAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('trading').prop('selectedComponent')
);

export const maxRiskAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('trading').prop('maxRisk')
);

export const maxMarketSlippageAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('trading').prop('maxMarketSlippage')
);

export const riskAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('scaleByRisk').prop('risk')
);

export const quantityScaledAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('scaleByRisk').prop('quantityScaled')
);

export const priceScaleRatioAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('trading').prop('priceScaleRatio')
);

export const twapLengthAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('twap').prop('length')
);

export const twapLotsCountAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('twap').prop('lotsCount')
);

export const tradeBuyIntoAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('trading').prop('buyInto')
);

export const tradeSellIntoAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('trading').prop('sellInto')
);

export const twapRandomnessAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('twap').prop('randomness')
);

export const chasePercentLimitAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('chase').prop('percentLimit')
);

export const _chaseInfiniteAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('chase').prop('infinite')
);

export const _chaseStalkAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('chase').prop('stalk')
);

export const chaseInfiniteAtom = atom(
  (get) => get(_chaseInfiniteAtom),
  (get, set, value: boolean) => {
    set(_chaseInfiniteAtom, value);
    if (get(_chaseStalkAtom) && value) set(_chaseStalkAtom, false);
  }
);

export const chaseStalkAtom = atom(
  (get) => get(_chaseStalkAtom),
  (get, set, value: boolean) => {
    set(_chaseStalkAtom, value);
    if (get(_chaseInfiniteAtom) && value) set(_chaseInfiniteAtom, false);
  }
);

export const fatFingerProtectionAtom = focusAtom(appSettingsAtom, (o) =>
  o.prop('trading').prop('fatFingerProtection')
);

export const fatFingerValueAtom = atom((get) => {
  const value = get(fatFingerProtectionAtom);
  const asNumber = pFloat(value);

  if (!Number.isNaN(asNumber) && asNumber > 0) {
    return asNumber;
  }

  return 0;
});

export const scaleFromAtom = atom('');
export const scaleToAtom = atom('');
export const scaleSizeReduceOnlyAtom = atom(false);

export const copyPriceAtom = atom(null, (get, set, value: number) => {
  const market = get(selectedMarketAtom);
  const selectedInput = get(tradeLastTouchedAtom);
  const selectedTrade = get(selectedTradeAtom);

  const pPrice = market?.precision?.price ?? 0.01;
  const pValue = adjust(value, pPrice).toString();

  if (selectedTrade === 'scale_in_risk') {
    if (selectedInput === 'from') set(tradeFromAtom, pValue);
    if (selectedInput === 'to') set(tradeStopLossAtom, pValue);
    if (selectedInput === 'takeProfit') set(tradeTakeProfitAtom, pValue);
  }

  if (selectedTrade === 'scale_in_size') {
    if (selectedInput === 'from') set(scaleFromAtom, pValue);
    if (selectedInput === 'to') set(scaleToAtom, pValue);
    if (selectedInput === 'takeProfit') set(tradeTakeProfitAtom, pValue);
    if (selectedInput === 'stopLoss') set(tradeStopLossAtom, pValue);
  }

  if (selectedTrade === 'all_in_one') {
    if (selectedInput === 'to') set(tradeStopLossAtom, pValue);
    if (selectedInput === 'takeProfit') set(tradeTakeProfitAtom, pValue);
  }

  if (selectedTrade === 'simple') {
    if (selectedInput === 'entry') set(simpleTradeEntryAtom, pValue);
  }
});
