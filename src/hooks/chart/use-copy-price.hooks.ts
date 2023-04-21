import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { copyPriceAtom } from '../../atoms/trade.atoms';

import type { CandleSeries, LightweightChart } from './chart.types';

export const useCopyChartPrice = ({
  chart,
  candleSeries,
}: {
  chart?: LightweightChart;
  candleSeries?: CandleSeries;
}) => {
  const copyPrice = useSetAtom(copyPriceAtom);

  useEffect(() => {
    const listener = (data: any) => {
      const price = candleSeries?.coordinateToPrice(data.point.y);
      if (price) copyPrice(price);
    };

    chart?.subscribeClick(listener);

    return () => {
      chart?.unsubscribeClick(listener);
    };
  }, [chart, candleSeries, copyPrice]);
};
