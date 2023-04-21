import cx from 'clsx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React from 'react';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';
import { TiDelete } from 'react-icons/ti';
import { TableVirtuoso } from 'react-virtuoso';
import type { Ticker } from 'gvm-cex/dist/types';

import { loadedAtom } from '../../app-state';
import { selectedSymbolAtom } from '../../atoms/trade.atoms';
import {
  displayedTickersAtom,
  tickersFilterAtom,
  orderByTickersAtom,
  orderTickersFnAtom,
  currentExchangeQuoteAtom,
  exchangeQuotesOptionsAtom,
} from '../../hooks/use-tickers.hooks';
import { GridBlockComponent } from '../ui/grid-block.component';
import { LoadingComponent } from '../ui/loading.component';

import { TickerComponent } from './ticker.component';

const columns: Array<{ label: string; key?: keyof Ticker }> = [
  { label: 'Symbol', key: 'symbol' },
  { label: 'Price', key: 'last' },
  { label: 'Volume', key: 'quoteVolume' },
  { label: '1d', key: 'percentage' },
];

const TableComponent = (props: Record<string, any>) => (
  <table {...props} className="table-auto w-full text-dark-text-white" />
);

const TableRowComponent = (
  props: Record<string, any> & {
    context?: {
      selectedSymbol: string;
      setSelectedSymbol: (symbol: string) => void;
    };
  }
) => (
  <tr
    {...props}
    className={cx(
      'font-mono text-xs font-bold hover:bg-dark-border-gray transition-colors ease-out cursor-pointer',
      {
        'bg-dark-border-gray':
          props.item.symbol === props.context?.selectedSymbol,
      }
    )}
    onClick={() => props.context?.setSelectedSymbol?.(props.item.symbol)}
  />
);

export const TickersComponent = () => {
  const displayedTickers = useAtomValue(displayedTickersAtom);
  const { tickers: loaded } = useAtomValue(loadedAtom);

  const [filter, setFilter] = useAtom(tickersFilterAtom);
  const [tickersQuote, setTickersQuote] = useAtom(currentExchangeQuoteAtom);
  const [selectedSymbol, setSelectedSymbol] = useAtom(selectedSymbolAtom);

  const [orderByAttr, orderByDirection] = useAtomValue(orderByTickersAtom);
  const orderTickers = useSetAtom(orderTickersFnAtom);

  const exchangeQuotesOptions = useAtomValue(exchangeQuotesOptionsAtom);

  const handleKeyDown = ({
    key,
    currentTarget,
  }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter') {
      const [firstMatch] = displayedTickers;
      if (firstMatch) setSelectedSymbol(firstMatch.symbol);
    }

    if (key === 'Escape') {
      setFilter('');
      currentTarget.blur();
    }
  };

  return (
    <GridBlockComponent
      newWindow="Tickers"
      title={<div className="font-bold">Tickers</div>}
    >
      <div className="px-2 py-3 h-full overflow-hidden select-none">
        {exchangeQuotesOptions.length > 1 && (
          <div className="w-full flex items-center justify-center mb-2">
            {exchangeQuotesOptions.map((quote) => (
              <div
                key={quote}
                className={cx(
                  'flex items-center justify-center font-mono text-xs font-bold uppercase border-2 rounded-md transition-opacity bg-slate-500/50 border-slate-500 w-full mx-1 cursor-pointer',
                  {
                    'opacity-100': quote === tickersQuote,
                    'opacity-30': quote !== tickersQuote,
                  }
                )}
                onClick={() => setTickersQuote(quote)}
              >
                {quote}
              </div>
            ))}
          </div>
        )}
        <div className="mb-2 relative">
          <input
            id="tickers-search"
            type="text"
            placeholder="Search..."
            className="w-full bg-dark-bg"
            value={filter}
            onChange={({ target }) => setFilter(target.value)}
            onKeyDown={handleKeyDown}
          />
          <span
            className={cx(
              'absolute cursor-pointer right-2 top-2 opacity-70 hover:opacity-100 transition-opacity',
              { hidden: !filter }
            )}
          >
            <TiDelete className="text-lg" onClick={() => setFilter('')} />
          </span>
        </div>
        <div
          className={cx('px-1 relative overflow-hidden', {
            'h-[calc(100%-36px)]': exchangeQuotesOptions.length <= 1,
            'h-[calc(100%-36px-25px)]': exchangeQuotesOptions.length > 1,
          })}
        >
          {!loaded ? (
            <LoadingComponent />
          ) : (
            <>
              <TableVirtuoso
                data={displayedTickers}
                className="no-scrollbar"
                totalCount={displayedTickers.length}
                context={{ selectedSymbol, setSelectedSymbol }}
                increaseViewportBy={{ top: 250, bottom: 250 }}
                components={{
                  Table: TableComponent,
                  TableRow: TableRowComponent,
                }}
                fixedHeaderContent={() => (
                  <tr className="font-mono text-xs text-dark-text-gray bg-dark-bg-2">
                    <th />
                    {columns.map((column, idx) => (
                      <th
                        key={column.label}
                        className={cx(
                          idx === 0 ? 'text-left' : 'text-right',
                          'pb-4 pt-2',
                          {
                            'text-dark-text-white/70':
                              orderByAttr === column.key,
                            'underline underline-offset-4 cursor-pointer decoration-dotted hover:text-dark-text-white':
                              Boolean(column.key),
                          }
                        )}
                        onClick={() =>
                          column.key ? orderTickers(column.key) : undefined
                        }
                      >
                        <span className="inline-flex items-center">
                          <span>{column.label}</span>
                          {column.key === orderByAttr && (
                            <span className="ml-3">
                              {orderByDirection === 'asc' ? (
                                <RiSortAsc />
                              ) : (
                                <RiSortDesc />
                              )}
                            </span>
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                )}
                itemContent={(_index, ticker) => (
                  <TickerComponent ticker={ticker} />
                )}
              />
            </>
          )}
        </div>
      </div>
    </GridBlockComponent>
  );
};
