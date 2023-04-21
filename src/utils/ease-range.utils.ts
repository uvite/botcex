import { easePolyOut, easePolyIn } from 'd3-ease';
import { OrderSide } from 'gvm-cex/dist/types';

const normalize = (min: number, max: number) => {
  const delta = max - min;

  return function (val: number) {
    return (val - min) / delta;
  };
};

const unNormalize = (min: number, max: number) => {
  const delta = max - min;

  return function (val: number) {
    return val * delta + min;
  };
};

const easeFunction = {
  [OrderSide.Buy]: [easePolyOut.exponent, easePolyIn.exponent],
  [OrderSide.Sell]: [easePolyIn.exponent, easePolyOut.exponent],
} as const;

export const easeRange = (
  range: number[],
  easeRatio: number,
  side: OrderSide
) => {
  const min = easeRatio > 2 ? 2 : 2;
  const max = easeRatio > 2 ? 3 : 1;

  const ratio = ((easeRatio - min) * (3 - 1)) / (max - min) + 1;
  const ease =
    easeRatio > 2 ? easeFunction[side][0](ratio) : easeFunction[side][1](ratio);

  const rMin = Math.min(...range);
  const rMax = Math.max(...range);

  return range
    .map(normalize(rMin, rMax))
    .map((val) => ease(val))
    .map(unNormalize(rMin, rMax));
};
