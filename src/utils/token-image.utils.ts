export const getTokenURL = (symbol: string) => {
  const path = symbol
    .replace(/USDT$|BUSD$/g, '')
    .replace('1000LUNC', 'LUNA')
    .replace('1000BONK', 'BONK')
    .toUpperCase();

  return `https://trustwallet-assets-api.vercel.app/api/symbol/${path}`;
};
