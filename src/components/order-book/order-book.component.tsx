import cx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import React, { useRef } from 'react';
import type { SingleValue } from 'react-select';
import Select from 'react-select';
import useResizeObserver from 'use-resize-observer';

import {
  orderBookDisplayDollarAtom,
  orderBookPrecisionOptionsAtom,
  orderBookPrecisitionOptionIdxAtom,
} from '../../atoms/orderbook.atoms';
import { useOrderBook } from '../../hooks/use-order-book.hooks';
import { GridBlockComponent } from '../ui/grid-block.component';

import { OrderBookTableComponent } from './order-book.table.component';

export const OrderBookComponent = () => {
  useOrderBook();

  const container = useRef<HTMLDivElement | null>(null);
  const { height } = useResizeObserver({ ref: container });
  const rows = (height ? Math.floor(height / 18) : 30) - 1;

  const [displayDollar, setDisplayDollar] = useAtom(orderBookDisplayDollarAtom);

  const options = useAtomValue(orderBookPrecisionOptionsAtom);
  const [precisionIdx, setPrecisionIdx] = useAtom(
    orderBookPrecisitionOptionIdxAtom
  );

  const onChange = (option: SingleValue<{ value: number; label: number }>) => {
    if (option) {
      setPrecisionIdx(options.findIndex((x) => x.value === option.value));
    }
  };

  return (
    <GridBlockComponent
      newWindow="Order book"
      title={
        <div className="flex items-center">
          <div className="font-bold">Order book</div>
          <div className="ml-auto flex items-center">
            <div
              className={cx(
                'mr-1 border-2 rounded-sm font-mono font-bold text-sm px-1.5 py-0.5 cursor-pointer',
                {
                  'border-dark-border-gray-2': displayDollar,
                  'border-dark-border-gray': !displayDollar,
                }
              )}
              onClick={() => setDisplayDollar(!displayDollar)}
            >
              $
            </div>
            <Select
              id="select-order-book-precision"
              instanceId="select-order-book-precision"
              className="react-select-container small z-50 mono"
              classNamePrefix="react-select"
              name="select-order-book-precision"
              isClearable={false}
              blurInputOnSelect={true}
              isSearchable={false}
              placeholder="Precision"
              options={options}
              value={options.find((_, idx) => idx === precisionIdx)}
              onChange={(o) => onChange(o)}
            />
          </div>
        </div>
      }
    >
      <div
        ref={container}
        className="h-full overflow-scroll no-scrollbar bg-dark-bg/70"
      >
        <OrderBookTableComponent rows={rows} />
      </div>
    </GridBlockComponent>
  );
};
