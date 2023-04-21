/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { atom } from 'jotai';
import type { Layouts } from 'react-grid-layout';
import { OrderSide } from 'gvm-cex/dist/types';

import pkg from '../package.json';

import { AppBlock, TradeComponentType, NewsTradeType } from './app.types';
import type { NewsSources } from './hooks/use-news/use-news.types';
import { PriceType } from './hooks/use-ticker-price.hooks';
import type { TickersWordsMapping } from './utils/ticker-match/ticker-match.atoms';

export type AppSettings = typeof defaultSettings;

export const defaultSettings = Object.freeze({
  // APP GRID LAYOUTS
  // -----------
  layouts: {
    lg: [
      { h: 10, i: AppBlock.Chart, w: 7, x: 4, y: 0 },
      { h: 6, i: AppBlock.Positions, w: 11, x: 4, y: 14 },
      { h: 6, i: AppBlock.Orders, w: 4, x: 11, y: 8 },
      { h: 4, i: AppBlock.Account, w: 5, x: 15, y: 0 },
      { h: 10, i: AppBlock.Trade, w: 5, x: 15, y: 4 },
      { h: 9, i: AppBlock.Tickers, w: 4, x: 0, y: 11 },
      { h: 6, i: AppBlock.TickerInfo, w: 5, x: 15, y: 14 },
      { h: 11, i: AppBlock.News, w: 4, x: 0, y: 0 },
      { h: 4, i: AppBlock.Logs, w: 7, x: 4, y: 10 },
      { h: 8, i: AppBlock.OrderBook, w: 4, x: 11, y: 0 },
    ],
    xs: [
      { h: 7, i: AppBlock.Chart, w: 9, x: 5, y: 0 },
      { h: 5, i: AppBlock.Positions, w: 14, x: 0, y: 14 },
      { h: 7, i: AppBlock.Orders, w: 4, x: 10, y: 7 },
      { h: 4, i: AppBlock.Account, w: 6, x: 14, y: 0 },
      { h: 10, i: AppBlock.Trade, w: 6, x: 14, y: 4 },
      { h: 6, i: AppBlock.Tickers, w: 5, x: 0, y: 8 },
      { h: 5, i: AppBlock.TickerInfo, w: 6, x: 14, y: 14 },
      { h: 8, i: AppBlock.News, w: 5, x: 0, y: 0 },
      { h: 5, i: AppBlock.Logs, w: 20, x: 0, y: 19 },
      { h: 7, i: AppBlock.OrderBook, w: 5, x: 5, y: 7 },
    ],
  } as Layouts,

  // Global app settings
  // -------------------
  global: {
    privacy: false,
    sound: true,
    preview: false,
    utc: true,
    hiddenBlocks: [] as AppBlock[],
  },

  // General trading preferences
  // ---------------------------
  trading: {
    selectedSymbol: 'BTCUSDT',
    selectedComponent: TradeComponentType.AllInOne,
    sellInto: PriceType.Bid,
    buyInto: PriceType.Ask,
    maxRisk: 25,
    priceScaleRatio: 2,
    scaledOrdersCount: 10,
    side: OrderSide.Buy,
    maxMarketSlippage: 0,
    fatFingerProtection: '',
  },

  // Scale by risk specific settings
  // ----------------------------
  scaleByRisk: {
    risk: 1,
    quantityScaled: 0.5,
  },

  // TWAP specific settings
  // ----------------------
  twap: {
    length: 90,
    lotsCount: 10,
    randomness: 0.1,
  },

  // Chase specific settings
  // -----------------------
  chase: {
    percentLimit: 0.25,
    infinite: false,
    stalk: false,
  },

  // News trading preferences
  // ------------------------
  news: {
    orderType: NewsTradeType.Market,
    orderMarketSettings: { maxSlippage: 0 },
    orderTwapSettings: { length: 5, lotsCount: 5, randomness: 0.1 },
    orderLimitSettings: { distance: 0 },
    defaultSize: 1000,
    defaultTickers: [] as string[],
    sizeMap: {} as Record<string, string>,
    oldLayout: false,
    wordsBlocklist: [] as string[],
    displayDots: true,
    autoSelectTicker: false,
    tradeShortcutsEnabled: false,
    treeNewsKey: '',
    text2Speech: false,
    text2SpeechPlaybackSpeed: 1,
    customTickerWordsMapping: {} as TickersWordsMapping,
    disabledSources: [] as NewsSources[],
  },

  // Order book
  // ----------
  orderBook: {
    displayDollar: false,
    precisionOptionIdx: 3,
  },

  // Favorites tickers
  // -----------------
  favorites: [] as string[],

  // Shortcuts
  // ---------
  shortcuts: {
    // toggle app settings
    toggleFavorite: ['f'],
    togglePreview: ['p'],
    toggleSettings: [','],
    togglePrivacy: ['h'],
    toggleSound: ['m'],
    // positions navigation
    nextPosition: ['j'],
    previousPosition: ['k'],
    // trading
    searchFocus: ['/'],
    cycleTimeframes: ['l'],
    // trade components
    allInOneFocus: ['F1'],
    simpleTrade: ['F2'],
    scaleByRiskFocus: ['F3'],
    scaleBySizeFocus: ['F4'],
    twapTrade: ['F5'],
    chaseTrade: ['F6'],
    // news trading
    nextNews: ['ArrowUp'],
    previousNews: ['ArrowDown'],
    selectFirstNews: ['PageUp'],
    buyNews: ['b'],
    sellNews: ['s'],
  },

  // Store last used version
  version: pkg.version,
});

export const appSettingsAtom = atom<AppSettings>(defaultSettings);
