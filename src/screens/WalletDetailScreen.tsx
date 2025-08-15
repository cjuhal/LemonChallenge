import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useWalletStore } from '../store/WalletStore';
import CryptoImage from '../components/CryptoImage';

type WalletDetailRouteProp = RouteProp<RootStackParamList, 'WalletDetail'>;

interface Props {
  route: WalletDetailRouteProp;
}

export default function WalletDetailScreen({ route }: Props) {
  const { wallet, exists } = route.params;
  const navigation = useNavigation();

  const toggleFavorite = useWalletStore(state => state.toggleFavorite);
  const favorites = useWalletStore(state => state.favorites);

  const isFavorite = favorites.some(f => f.address === wallet.address);

  return (
    <View style={styles.container}>
      <CryptoImage symbol={wallet.network} size={80} />
      <Text style={styles.symbol}>{wallet.network}</Text>
      <Text style={styles.address}>{wallet.address}</Text>

      {wallet.network === 'UNKNOWN' && (
        <Text style={{ color: '#F87171', marginTop: 8 }}>Esta dirección no es válida y no se agregará</Text>
      )}

      {exists && <Text style={styles.exists}>Esta wallet ya está en tu historial</Text>}

      {wallet.network !== 'UNKNOWN' && (
        <TouchableOpacity
          style={[styles.button, isFavorite ? styles.btnRemove : styles.btnAdd]}
          onPress={() => toggleFavorite(wallet)}
        >
          <Text style={styles.btnText}>
            {isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.btnBack]}
        onPress={() => navigation.navigate('Main' as never, { screen: 'QR' } as never)}
      >
        <Text style={styles.btnText}>Volver a escanear</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E0F13', alignItems: 'center', justifyContent: 'center', padding: 20 },
  symbol: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  address: { fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center' },
  exists: { color: '#FBBF24', marginTop: 4 },
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginTop: 20 },
  btnAdd: { backgroundColor: '#22C55E' },
  btnRemove: { backgroundColor: '#EF4444' },
  btnBack: { backgroundColor: '#3B82F6' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
