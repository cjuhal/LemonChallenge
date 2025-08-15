import React, { useState, useMemo, useEffect } from 'react';
import { View, FlatList, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useWalletStore } from '../store/WalletStore';
import WalletsItem from '../components/WalletItem';

const FILTERS = ['Todas', 'Favoritas', 'BTC', 'ETH', 'LTC', 'TRX', 'Otros'];

export default function WalletListScreen() {
  const history = useWalletStore(state => state.history);
  const favorites = useWalletStore(state => state.favorites);
  const loadWallets = useWalletStore(state => state.loadWallets);

  const [selectedFilter, setSelectedFilter] = useState('Todas');

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  const filteredWallets = useMemo(() => {
    let wallets: typeof history = [];

    if (selectedFilter === 'Todas') wallets = history;
    else if (selectedFilter === 'Favoritas') wallets = history.filter(w => favorites.some(f => f.address === w.address));
    else if (selectedFilter === 'Otros') wallets = history.filter(w => !['BTC', 'ETH', 'LTC', 'TRX'].includes(w.network));
    else wallets = history.filter(w => w.network === selectedFilter);

    return wallets;
  }, [history, favorites, selectedFilter]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0E0F13' }}>
      {/* Filtro horizontal */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {FILTERS.map(filter => {
            const isSelected = filter === selectedFilter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Listado */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredWallets}
          keyExtractor={(item, index) => `${item.network}_${item.address}_${index}`}
          renderItem={({ item }) => <WalletsItem wallet={item} />}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#9CA3AF' }}>
              No hay wallets
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterWrapper: {
    height: 48,
    justifyContent: 'center',
    backgroundColor: '#0E0F13',
  },
  filterContainer: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  filterButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 32,
  },
  filterButtonSelected: {
    backgroundColor: '#22C55E',
  },
  filterText: {
    color: '#22C55E',
    fontWeight: '500',
    fontSize: 14,
  },
  filterTextSelected: {
    color: '#fff',
  },
});
