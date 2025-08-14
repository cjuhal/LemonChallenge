import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export type SortOrder = 'market_cap_desc' | 'market_cap_asc' | 'price_desc' | 'price_asc';

type Props = {
  onFilterChange: (params: {
    order?: SortOrder;
    priceMin?: number;
    priceMax?: number;
    onlyPositive?: boolean;
  }) => void;

  // props iniciales para precargar filtros
  initialOrder?: SortOrder;
  initialPriceMin?: number;
  initialPriceMax?: number;
  initialOnlyPositive?: boolean;
};

export default function SortFilterModal({
  onFilterChange,
  initialOrder,
  initialPriceMin,
  initialPriceMax,
  initialOnlyPositive,
}: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('todas');
  const [marketCapOrder, setMarketCapOrder] = useState<'desc' | 'asc'>(
    initialOrder?.includes('asc') ? 'asc' : 'desc'
  );
  const [priceMin, setPriceMin] = useState(initialPriceMin?.toString() || '');
  const [priceMax, setPriceMax] = useState(initialPriceMax?.toString() || '');

  useEffect(() => {
    // Aplicar filtros iniciales al montar
    onFilterChange({
      order: initialOrder,
      priceMin: initialPriceMin,
      priceMax: initialPriceMax,
      onlyPositive: initialOnlyPositive,
    });
  }, []);

  const filters = [
    { key: 'todas', label: 'Todas' },
    { key: 'marketcap', label: 'MarketCap' },
    { key: 'precio', label: 'Precio' },
    { key: 'gainers', label: 'Gainers' },
    { key: 'losers', label: 'Losers' },
  ];

  const applyFilter = (key: string) => {
    setActiveFilter(key);

    if (key === 'todas') {
      onFilterChange({});
    } else if (key === 'marketcap') {
      const _order = marketCapOrder === 'desc' ? 'market_cap_desc' : 'market_cap_asc';
      onFilterChange({ order: _order });
      setMarketCapOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else if (key === 'gainers') {
      onFilterChange({ order: 'price_desc' });
    } else if (key === 'losers') {
      onFilterChange({ order: 'price_asc' });
    } else if (key === 'precio') {
      onFilterChange({
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
      });
    }
  };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterBtn,
              activeFilter === f.key && { backgroundColor: '#22C55E' },
            ]}
            onPress={() => applyFilter(f.key)}
          >
            <Text style={[styles.filterText, activeFilter === f.key && { color: '#0b0e14' }]}>
              {f.label}
            </Text>
            {f.key === 'marketcap' && activeFilter === 'marketcap' && (
              <MaterialIcons
                name={marketCapOrder === 'desc' ? 'arrow-downward' : 'arrow-upward'}
                size={16}
                color="#0b0e14"
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeFilter === 'precio' && (
        <View style={styles.priceRow}>
          <TextInput
            mode="flat"
            keyboardType="numeric"
            placeholder="Mín"
            placeholderTextColor="#6B7280"
            value={priceMin}
            onChangeText={text => {
              setPriceMin(text);
              onFilterChange({ priceMin: text ? Number(text) : undefined, priceMax: priceMax ? Number(priceMax) : undefined });
            }}
            style={styles.input}
            textColor="#fff"
            underlineColor="transparent"
            activeUnderlineColor="#22C55E"
            selectionColor="#22C55E"
          />
          <TextInput
            mode="flat"
            keyboardType="numeric"
            placeholder="Máx"
            placeholderTextColor="#6B7280"
            value={priceMax}
            onChangeText={text => {
              setPriceMax(text);
              onFilterChange({ priceMin: priceMin ? Number(priceMin) : undefined, priceMax: text ? Number(text) : undefined });
            }}
            style={styles.input}
            textColor="#fff"
            underlineColor="transparent"
            activeUnderlineColor="#22C55E"
            selectionColor="#22C55E"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#11131a',
    marginRight: 8,
  },
  filterText: {
    color: '#fff',
    marginRight: 4,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#11131a',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
