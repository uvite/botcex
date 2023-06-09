import useSize from '@react-hook/size';
import cx from 'clsx';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { useRef } from 'react';
import type { Ticker } from 'gvm-cex/dist/types';
import { OrderSide } from 'gvm-cex/dist/types';
import { afterDecimal } from 'gvm-cex/dist/utils/safe-math';

import { marketsAtom } from '../../app-state';
import { selectedSymbolAtom } from '../../atoms/trade.atoms';
import {
  newsTradeShortcutsEnabledAtom,
  useTickerTradeSizeMap,
} from '../../hooks/trade/use-news-trade.hooks';
import { useApeNews } from '../../hooks/use-ape-news.hooks';
import { useKeyBindings } from '../../hooks/use-keybindings.hooks';
import { shortcutsAtom } from '../../hooks/use-shortcuts.hooks';
import { tickerRegex } from '../../utils/ticker-match/ticker-match.utils';
import { getTokenURL } from '../../utils/token-image.utils';
import { OrderSideButton } from '../ui/order-side-button.component';

export const ApeButtonsComponent = ({
  ticker,
  selected,
}: {
  ticker: Ticker;
  selected?: boolean;
}) => {
  const el = useRef(null);
  const w = useSize(el)[0];
  const lg = w > 330;

  const setSelected = useSetAtom(selectedSymbolAtom);

  const markets = useAtomValue(marketsAtom);
  const market = markets.find((m) => m.symbol === ticker.symbol);

  const [size, setSize] = useTickerTradeSizeMap(ticker.symbol);

  const shortcuts = useAtomValue(shortcutsAtom);
  const shortcutsEnabled = useAtomValue(newsTradeShortcutsEnabledAtom);

  const apeNews = useApeNews();

  useKeyBindings(
    [
      {
        keys: shortcuts.buyNews,
        onEvent: (event) => {
          event.preventDefault();
          apeNews({ side: OrderSide.Buy, symbol: ticker.symbol });
        },
      },
      {
        keys: shortcuts.sellNews,
        onEvent: (event) => {
          event.preventDefault();
          apeNews({ side: OrderSide.Sell, symbol: ticker.symbol });
        },
      },
    ],
    selected && shortcutsEnabled
  );

  return (
    <div ref={el} className="flex items-center mt-1 select-none first:mt-0">
      <div
        className={cx(
          'rounded-full overflow-hidden w-[12px] h-[12px] mr-2',
          lg ? 'block' : 'hidden'
        )}
      >
        <img
          alt={ticker.symbol}
          height={16}
          width={16}
          src={getTokenURL(ticker.symbol)}
        />
      </div>
      <div
        className="flex items-center cursor-pointer w-[30px]"
        onClick={() => setSelected(ticker.symbol)}
      >
        <div className="font-semibold font-mono text-xs">
          {ticker.symbol.replace(tickerRegex, '')}
        </div>
      </div>
      <div
        className="flex-1 text-center text-[10px] cursor-pointer"
        onClick={() => setSelected(ticker.symbol)}
      >
        <div className="font-mono font-bold">
          $
          {ticker.last.toFixed(
            afterDecimal(market?.precision?.price || ticker.last)
          )}
        </div>
        <div>
          <span
            className={cx(
              'font-mono font-semibold',
              ticker.percentage < 0 ? 'text-red-500' : 'text-dark-green'
            )}
          >
            {ticker.percentage < 0 ? '-' : '+'}
            {(Math.round(Math.abs(ticker.percentage) * 100) / 100).toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="flex items-center ml-auto">
        <div className="mr-4">
          <span className="font-bold mr-1">$</span>
          <input
            className="w-[65px] text-xs font-semibold text-right font-mono"
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </div>
        <OrderSideButton
          className="mr-2 h-100 text-sm"
          selected={true}
          side={OrderSide.Buy}
          label={lg ? 'BUY' : 'B'}
          onClick={() =>
            apeNews({ side: OrderSide.Buy, symbol: ticker.symbol })
          }
        />
        <OrderSideButton
          className="h-100 text-sm"
          selected={true}
          side={OrderSide.Sell}
          label={lg ? 'SELL' : 'S'}
          onClick={() =>
            apeNews({ side: OrderSide.Sell, symbol: ticker.symbol })
          }
        />
      </div>
    </div>
  );
};
