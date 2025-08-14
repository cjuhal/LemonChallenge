import React, { useCallback, useMemo, useState } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useInfiniteQuery, type QueryFunctionContext } from '@tanstack/react-query';
import { fetchMarkets, type MarketCoin } from '../services/coingecko';
import CryptoListItem from '../components/CryptoListItem';
import SearchBar from '../components/SearchBar';
import SortFilterModal, { type SortOrder } from '../components/SortFilterModal';

import { Surface, Text, ActivityIndicator, Divider } from 'react-native-paper';

const PER_PAGE = 25;

export default function MarketsScreen() {
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState<SortOrder>('market_cap_desc');
  const [priceMin, setPriceMin] = useState<number | undefined>();
  const [priceMax, setPriceMax] = useState<number | undefined>();
  const [onlyPositive, setOnlyPositive] = useState<boolean>(false);

  const query = useInfiniteQuery<MarketCoin[], Error>({
    queryKey: ['markets', order],
    queryFn: async (param: QueryFunctionContext) => {
      return fetchMarkets({ vs_currency: 'usd', order, page: param.pageParam as number, per_page: PER_PAGE });
    },
    getNextPageParam: (lastPage) => (lastPage.length === PER_PAGE ? lastPage.length + 1 : undefined),
    staleTime: 30_000,
    initialPageParam: 1,
  });


  const data = useMemo(() => {
    const flat = (query.data?.pages ?? []).flat() as MarketCoin[];
    const filtered = flat.filter((c: MarketCoin) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.symbol.toLowerCase().includes(search.toLowerCase());
      const inMin = priceMin == null || c.current_price >= priceMin;
      const inMax = priceMax == null || c.current_price <= priceMax;
      const pos = !onlyPositive || (c.price_change_percentage_24h ?? 0) >= 0;
      return matchesSearch && inMin && inMax && pos;
    });
    return filtered;
  }, [query.data, search, priceMin, priceMax, onlyPositive]);

  const onEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
  }, [query.hasNextPage, query.isFetchingNextPage]);

  const onApply = (p: { order?: SortOrder; priceMin?: number; priceMax?: number; onlyPositive?: boolean }) => {
    if (p.order) setOrder(p.order);
    setPriceMin(p.priceMin);
    setPriceMax(p.priceMax);
    setOnlyPositive(!!p.onlyPositive);
  };

  return (
    <Surface style={styles.container}>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        onClear={() => setSearch('')}
      />

      <SortFilterModal
        onFilterChange={onApply}
        initialOrder={order}
        initialPriceMin={priceMin}
        initialPriceMax={priceMax}
        initialOnlyPositive={onlyPositive}
      />

      <FlatList
        data={data}
        keyExtractor={(item: MarketCoin, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <CryptoListItem item={item} />}
        contentContainerStyle={{ paddingVertical: 8 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={query.isRefetching}
            onRefresh={() => query.refetch()}
            tintColor="#22C55E"
          />
        }
        ListEmptyComponent={
          query.isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator animating size="large" />
              <Text variant="bodyMedium" style={styles.muted}>
                Cargando criptomonedas…
              </Text>
            </View>
          ) : query.isError ? (
            <View style={styles.center}>
              <Text variant="bodyMedium" style={styles.error}>
                Hubo un error al cargar. Desliza hacia abajo para reintentar.
              </Text>
            </View>
          ) : (
            <View style={styles.center}>
              <Text variant="bodyMedium" style={styles.muted}>
                No se encontraron resultados.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          query.isFetchingNextPage ? (
            <View style={{ paddingVertical: 12 }}>
              <ActivityIndicator animating size="small" />
            </View>
          ) : null
        }
      />

    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0D12', padding: 12 },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: 48 },
  muted: { color: '#9CA3AF', marginTop: 8 },
  error: { color: '#EF4444' },
  divider: { backgroundColor: '#222', height: 1 },
});
