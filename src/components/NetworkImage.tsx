import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import BTC from '@assets/Bitcoin.png';
import ETH from '@assets/Ethereum.png';
import LTC from '@assets/Ltc.png';
import TRX from '@assets/trx.png';
import CoinUnknow from '@assets/coin-unknow.png';
import ARS from '@assets/ARS.png';
import USD from '@assets/USD.png';
import EUR from '@assets/EUR.png';
import PEN from '@assets/PEN.png';

interface NetworkImageProps {
  network: string;
  size?: number;
}

const networkImages: Record<string, any> = {
  BTC,
  ETH,
  LTC,
  TRX,
  ARS,
  USD,
  EUR,
  PEN
};

export default function NetworkImage({ network, size = 40 }: NetworkImageProps) {
  const source = networkImages[network] || CoinUnknow;

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
