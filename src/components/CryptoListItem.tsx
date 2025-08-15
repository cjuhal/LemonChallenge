import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import type { MarketCoin } from '../services/coingecko'

type Props = { item: MarketCoin };

function CryptoListItemBase({ item }: Props) {
  const change = item.price_change_percentage_24h ?? 0;
  const isUp = change >= 0;

  return (
    <Surface
      style={styles.row}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${item.name} ${item.symbol}, precio ${item.current_price}, cambio 24h ${change.toFixed(2)} por ciento`}
      elevation={2}
      mode="flat"
    >
      <Image source={{ uri: item.image }} style={styles.icon} />
      <Surface style={styles.nameContainer} elevation={0} mode="flat">
        <Text variant="titleMedium" style={styles.name}>
          {item.symbol.toUpperCase()}{' '}
          <Text variant="bodySmall" style={styles.symbol}>
            {`#${item.market_cap_rank ?? '-'}`}
          </Text>
        </Text>
        <Text variant="bodySmall" style={styles.rank}>
          {item.name}
        </Text>
      </Surface>
      <Surface style={styles.priceContainer} elevation={0} mode="flat">
        <Text variant="titleMedium" style={styles.price}>
          {`${!!item?.current_price ? item?.current_price.toFixed(2).toLocaleString() : '0.00'} USD`}
        </Text>
        <Text
          variant="bodySmall"
          style={[styles.change, { color: isUp ? '#10B981' : '#EF4444' }]}
        >
          {isUp ? '▲' : '▼'} {change.toFixed(2)}%
        </Text>
      </Surface>
    </Surface>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    backgroundColor: '#11131a',
    marginVertical: 4,
    borderRadius: 8,
  },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#222' },
  nameContainer: { flex: 1, justifyContent: 'center' },
  name: { color: '#fff', fontWeight: '700' },
  symbol: { color: '#9CA3AF', fontWeight: '600' },
  rank: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  priceContainer: { alignItems: 'flex-end', justifyContent: 'center' },
  price: { color: '#F9FAFB', fontWeight: '700' },
  change: { fontWeight: '700', marginTop: 2 },
});

export default memo(CryptoListItemBase);
