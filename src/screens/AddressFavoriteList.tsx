import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useWalletStore } from '../store/WalletStore';
import AddressFavoriteItem from '../components/AddressFavoriteItem';

const FILTERS = ['Todas', 'BTC', 'ETH', 'LTC', 'TRX', 'Otros'];

export default function AddressFavoriteList() {
  const favorites = useWalletStore(state => state.favorites);
  const loadWallets = useWalletStore(state => state.loadWallets);
  const [selectedFilter, setSelectedFilter] = useState('Todas');

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  const filteredFavorites = useMemo(() => {
    if (selectedFilter === 'Todas') return favorites;
    if (selectedFilter === 'Otros') return favorites.filter(f => !['BTC', 'ETH', 'LTC', 'TRX'].includes(f.network));
    return favorites.filter(f => f.network === selectedFilter);
  }, [favorites, selectedFilter]);

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
          data={filteredFavorites}
          keyExtractor={(item, index) => `${item.network}_${item.address}_${index}`}
          renderItem={({ item }) => <AddressFavoriteItem wallet={item} />}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#9CA3AF' }}>
              No hay wallets en favoritos
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterWrapper: {
    height: 48, // altura fija para el scroll
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
