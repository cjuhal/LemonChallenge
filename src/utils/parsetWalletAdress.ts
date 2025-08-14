export function parseWalletAddress(raw: string) {
  try {
    const lower = raw.toLowerCase();
    if (lower.startsWith('bitcoin:')) return { network: 'BTC', address: raw.split(':')[1] };
    if (lower.startsWith('ethereum:')) return { network: 'ETH', address: raw.split(':')[1] };
    if (lower.startsWith('litecoin:')) return { network: 'LTC', address: raw.split(':')[1] };
    if (lower.startsWith('tron:')) return { network: 'TRX', address: raw.split(':')[1] };
    if (raw.startsWith('0x') && raw.length >= 26) return { network: 'ETH', address: raw };
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(raw)) return { network: 'BTC', address: raw };
    return { network: 'UNKNOWN', address: raw };
  } catch {
    return null;
  }
}
