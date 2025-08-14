import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useWalletStore } from '../store/WalletStore';
import AddressFavoriteItem from '../components/AddressFavoriteItem';

export default function AddressFavoriteList() {

  const favorites = useWalletStore(state => state.favorites);
  const loadWallets = useWalletStore(state => state.loadWallets);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item, index) => `${item.network}_${item.address}_${index}`}
      renderItem={({ item }) => <AddressFavoriteItem wallet={item} />}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#9CA3AF' }}>
          No hay wallets en favoritos
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({});
