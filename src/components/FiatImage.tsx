import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import ARS from '@assets/ARS.png';
import USD from '@assets/USD.png';
import EUR from '@assets/EUR.png';
import PEN from '@assets/PEN.png';
import CoinUnknow from '@assets/coin-unknow.png';

interface FiatImageProps {
  symbol: string;
  size?: number;
}

const fiatImages: Record<string, any> = {
  ARS,
  USD,
  EUR,
  PEN
};

export default function FiatImage({ symbol, size = 40 }: FiatImageProps) {
  const source = fiatImages[symbol] || CoinUnknow;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={source} style={{ width: size, height: size }} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
