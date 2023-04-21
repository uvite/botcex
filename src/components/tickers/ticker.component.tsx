import cx from 'clsx';
import { useAtomValue } from 'jotai';
import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import type { Ticker } from 'gvm-cex/dist/types';
import { afterDecimal } from 'gvm-cex/dist/utils/safe-math';
import useColorChange from 'use-color-change';

import { marketsAtom } from '../../app-state';
import { useFavorites } from '../../hooks/use-favorites.hooks';
import { abbreviateNumber } from '../../utils/formatter.utils';

export const TickerComponent = ({ ticker }: { ticker: Ticker }) => {
  const markets = useAtomValue(marketsAtom);
  const market = markets.find((m) => m.symbol === ticker.symbol);

  const { isFav, toggleFav } = useFavorites();

  const colorStyle = useColorChange(ticker.last!, {
    higher: '#45b26b',
    lower: '#ef4444',
    duration: 1500,
  });

  return (
    <>
      <td className="w-[25px]">
        <span
          className="cursor-pointer"
          onClick={() => toggleFav(ticker.symbol)}
        >
          <AiFillStar color={isFav(ticker.symbol) ? '#EAB308' : '#777E90'} />
        </span>
      </td>
      <td className="min-w-[100px]">{ticker.symbol}</td>
      <td className="text-right" style={colorStyle}>
        $
        {ticker.last.toFixed(
          afterDecimal(market?.precision?.price || ticker.last)
        )}
      </td>
      <td className="text-right min-w-[60px]">
        {abbreviateNumber(Math.round(ticker.quoteVolume * 100) / 100)}
      </td>
      <td
        className={cx('text-right min-w-[60px]', {
          'text-dark-green': ticker.percentage >= 0,
          'text-red-500': ticker.percentage < 0,
        })}
      >
        {(Math.round(ticker.percentage * 100) / 100).toFixed(2)}%
      </td>
    </>
  );
};
