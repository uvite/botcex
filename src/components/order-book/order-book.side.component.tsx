import cx from 'clsx';
import { useSetAtom } from 'jotai';
import React from 'react';
import type { OrderBookOrders } from 'gvm-cex/dist/types';
import { afterDecimal } from 'gvm-cex/dist/utils/safe-math';

import { copyPriceAtom } from '../../atoms/trade.atoms';
import { abbreviateNumber } from '../../utils/formatter.utils';

const calcSize = (amount: number, max: number) => {
  return Math.round((amount * 100) / max);
};

export const OrderBookSideComponent = ({
  side,
  orders,
  max,
  precision: pPrice,
}: {
  side: 'asks' | 'bids';
  max: number;
  precision: number;
  orders: OrderBookOrders[];
}) => {
  const precision = afterDecimal(pPrice);
  const copyPrice = useSetAtom(copyPriceAtom);

  return (
    <div className="w-full relative">
      <div className="w-full absolute top-[32px]">
        {orders.map((order, i) => (
          <div
            key={order.price}
            className={cx('absolute h-[18px]', {
              'bg-green-900/40 right-0': side === 'bids',
              'bg-red-900/40 left-0': side === 'asks',
            })}
            style={{
              width: `${calcSize(order.total, max)}%`,
              top: `${i * 18}px`,
            }}
          />
        ))}
      </div>
      <table className="table table-fixed font-mono text-xs w-full">
        <thead>
          {side === 'bids' ? (
            <tr className="text-dark-text-gray uppercase h-[32px]">
              <th className="text-left pl-1 py-2">Price</th>
              <th className="text-left py-2">Size</th>
              <th />
            </tr>
          ) : (
            <tr className="text-dark-text-gray uppercase h-[32px]">
              <th />
              <th className="text-right py-2">Size</th>
              <th className="text-right py-2 pr-1">Price</th>
            </tr>
          )}
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.price} className="h-[18px]">
              {side === 'bids' ? (
                <>
                  <td className="text-dark-green pl-1">
                    <span
                      className="cursor-pointer"
                      onClick={() => copyPrice(order.price)}
                    >
                      {order.price.toFixed(precision)}
                    </span>
                  </td>
                  <td className="text-dark-green">
                    {abbreviateNumber(order.amount)}
                  </td>
                  <td className="text-right text-white/50 pr-1">
                    {abbreviateNumber(order.total)}
                  </td>
                </>
              ) : (
                <>
                  <td className="text-left text-white/50 pl-1">
                    {abbreviateNumber(order.total)}
                  </td>
                  <td className="text-red-500 text-right">
                    {abbreviateNumber(order.amount)}
                  </td>
                  <td className="text-red-500 text-right pr-1">
                    <span
                      className="cursor-pointer"
                      onClick={() => copyPrice(order.price)}
                    >
                      {order.price.toFixed(precision)}
                    </span>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
