import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 12000,
});

export type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap_rank: number | null;
};
//ejemplo: https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_asc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%27
//doc: https://docs.coingecko.com/reference/coins-markets
export async function fetchMarkets(params: {
  vs_currency: string;
  page: number;
  per_page: number;
  order: 'market_cap_desc' | 'market_cap_asc' | 'price_desc' | 'price_asc';
}): Promise<MarketCoin[]> {
  const { data } = await api.get('/coins/markets', {
    params: {
      vs_currency: params.vs_currency,
      order: params.order,
      per_page: params.per_page,
      page: params.page,
      sparkline: false,
      price_change_percentage: '24h',
    },
  });
  return data;
}

export async function getSupportedVsCurrencies(): Promise<string[]> {
  const { data } = await api.get('/simple/supported_vs_currencies');
  return data;
}

export async function getSimplePrice(opts: {
  ids: string[];
  vs_currencies: string[];
  include_24hr_change?: boolean;
}): Promise<Record<string, Record<string, number>>> {
  const { data } = await api.get('/simple/price', {
    params: {
      ids: opts.ids.join(','),
      vs_currencies: opts.vs_currencies.join(','),
      include_24hr_change: opts.include_24hr_change ? 'true' : 'false',
    },
  });
  return data;
}