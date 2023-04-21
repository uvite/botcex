import { pFloat } from './parse-float.utils';

export const toUSD = (val: number | string) => {
  const num = pFloat(val);
  const abs = Math.round(Math.abs(num) * 100) / 100;
  return `${num < 0 ? '-' : ''}$${abs.toFixed(2)}`;
};
