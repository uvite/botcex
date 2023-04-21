export enum AppBlock {
  Chart = 'chart',
  Positions = 'positions',
  Orders = 'orders',
  Account = 'account',
  Trade = 'trade',
  Tickers = 'tickers',
  TickerInfo = 'ticker-info',
  News = 'news',
  Logs = 'logs',
  OrderBook = 'order-book',
}

export enum NewsTradeType {
  Market = 'market',
  Limit = 'limit',
  Twap = 'twap',
  Chase = 'chase',
}

export enum TradeComponentType {
  AllInOne = 'all_in_one',
  Simple = 'simple',
  ScaleInRisk = 'scale_in_risk',
  ScaleInSize = 'scale_in_size',
  Twap = 'twap',
  Chase = 'chase',
}

export const tradeOptions = [
  { value: TradeComponentType.AllInOne, label: 'All-in-One' },
  { value: TradeComponentType.Simple, label: 'Simple' },
  { value: TradeComponentType.ScaleInRisk, label: 'Scale in by risk' },
  { value: TradeComponentType.ScaleInSize, label: 'Scale in by size' },
  { value: TradeComponentType.Twap, label: 'TWAP' },
  { value: TradeComponentType.Chase, label: 'Chase' },
];

export enum Exchange {
  Bybit = 'bybit',
  Binance = 'binance',
  Woo = 'woo',
  OKX = 'okx',
}

export const exchangesLogo = {
  [Exchange.Bybit]: '/bybit.png',
  [Exchange.Binance]: '/binance.png',
  [Exchange.Woo]: '/woo.svg',
  [Exchange.OKX]: '/okx.png',
};

export const exchangesRef = {
  [Exchange.Bybit]: {
    link: 'https://partner.bybit.com/b/tuleep',
    label: '$30,000 deposit bonus',
    help: 'https://docs.tuleep.trade/getting-started/create-exchange-api-key/bybit',
  },
  [Exchange.Woo]: {
    link: 'https://x.woo.org/register?ref=TULEEP',
    label: '0 fees for 14 days',
    help: 'https://docs.tuleep.trade/getting-started/create-exchange-api-key/woo-x',
  },
  [Exchange.Binance]: {
    link: 'https://accounts.binance.com/en/register?ref=KOLLSXK0',
    label: '$100 deposit bonus',
    help: 'https://docs.tuleep.trade/getting-started/create-exchange-api-key/binance',
  },
  [Exchange.OKX]: {
    link: 'https://www.okx.com/join/TULEEP',
    label: '$10,000 deposit bonus and 20% less fees',
    help: 'https://docs.tuleep.trade/getting-started/create-exchange-api-key/okx',
  },
};

export const exchanges = [
  Exchange.Bybit,
  Exchange.Woo,
  Exchange.OKX,
  Exchange.Binance,
];

export const exchangesLabel = {
  [Exchange.Bybit]: 'Bybit',
  [Exchange.Binance]: 'Binance',
  [Exchange.Woo]: 'WOO X',
  [Exchange.OKX]: 'OKX',
};

export type Quote = 'BUSD' | 'USD' | 'USDC' | 'USDT';
export const quotes: Quote[] = ['USDT', 'USDC', 'BUSD', 'USD'];

export type ExchangesQuotes = {
  [key in Exchange]?: Quote;
};
