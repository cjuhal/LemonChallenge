import WAValidator from 'multicoin-address-validator';

const symbolToNetwork: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  LTC: 'litecoin',
  TRX: 'tron',
  DOGE: 'dogecoin',
  DASH: 'dash',
  XRP: 'ripple',
  ZEC: 'zcash',
  XMR: 'monero',
};

export function parseWalletAddress(raw: string) {
  // Si viene con formato "network:address", separar
  const [maybeNetwork, maybeAddress] = raw.includes(':') ? raw.split(':') : [null, raw];
  const address = (maybeAddress || maybeNetwork).trim();

  for (const [symbol, network] of Object.entries(symbolToNetwork)) {
    if (WAValidator.validate(address, network)) {
      return {
        network: symbol,
        address
      };
    }
  }

  return { network: 'UNKNOWN', address };
}