import React, { useCallback, useMemo, useState } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useInfiniteQuery, type QueryFunctionContext } from '@tanstack/react-query';
import { fetchMarkets, type MarketCoin, SortOrder } from '../services/coingecko';
import CryptoListItem from '../components/CryptoListItem';
import { Surface, Text, ActivityIndicator } from 'react-native-paper';
import { useMarketStore } from '../store/MarketStore';
import AdvancedFilterModal, { type PriceFilterOption } from '../components/AdvancedFilterModal';
import OrderFilterBar from '../components/OrderFilterBar';

export default function MarketsScreen() {
  const searchText = useMarketStore(state => state.searchText);

  const [order, setOrder] = useState<SortOrder>('market_cap_desc');
  const [includeTokens, setIncludeTokens] = useState<'top' | 'all'>('top');
  const [priceMin, setPriceMin] = useState<number | undefined>();
  const [priceMax, setPriceMax] = useState<number | undefined>();
  const [perPage, setPerPage] = useState<number>(50);
  const [priceOption, setPriceOption] = useState<PriceFilterOption>('all');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const query = useInfiniteQuery<MarketCoin[], Error>({
    queryKey: ['markets', order, perPage, includeTokens],
    queryFn: async (param: QueryFunctionContext) => {
      return fetchMarkets({
        vs_currency: 'usd',
        order: order ?? 'market_cap_desc',
        page: param.pageParam as number,
        per_page: perPage,
        include_tokens: includeTokens,
      });
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.length === perPage ? allPages.length + 1 : undefined),
    staleTime: 30_000,
    initialPageParam: 1,
  });

  const data = useMemo(() => {
    const flat = (query.data?.pages ?? []).flat() as MarketCoin[];
    return flat.filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.symbol.toLowerCase().includes(searchText.toLowerCase());

      const inMin = priceMin == null || c.current_price >= priceMin;
      const inMax = priceMax == null || c.current_price <= priceMax;

      const pos =
        priceOption === 'all'
          ? true
          : priceOption === 'positive'
            ? (c.price_change_percentage_24h ?? 0) >= 0
            : (c.price_change_percentage_24h ?? 0) < 0;

      return matchesSearch && inMin && inMax && pos;
    });
  }, [query.data, searchText, priceMin, priceMax, priceOption]);

  const onEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
  }, [query.hasNextPage, query.isFetchingNextPage]);

  const onApplyFilters = (filters: {
    priceMin?: number;
    priceMax?: number;
    perPage?: number;
    priceOption?: PriceFilterOption;
  }) => {
    setPriceMin(filters.priceMin);
    setPriceMax(filters.priceMax);
    setPerPage(filters.perPage ?? 50);
    setPriceOption(filters.priceOption ?? 'all');
  };

  return (
    <Surface style={styles.container}>
      {/* Header de filtros con altura fija */}
      <View style={{ height: 50 }}>
        <OrderFilterBar
          initialOrder={order}
          initialInclude={includeTokens}
          onChange={(newOrder, newInclude) => {
            setOrder(newOrder);
            setIncludeTokens(newInclude);
          }}
          onOpenAdvancedFilter={() => setShowAdvancedFilter(true)}
        />
      </View>

      {/* FlatList ocupando el resto de la pantalla */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <CryptoListItem item={item} />}
        contentContainerStyle={{ flexGrow: 1 }}
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
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {query.isLoading ? (
              <>
                <ActivityIndicator animating size="large" />
                <Text variant="bodyMedium" style={styles.muted}>
                  Cargando criptomonedas…
                </Text>
              </>
            ) : query.isError ? (
              <Text variant="bodyMedium" style={styles.error}>
                Hubo un error al cargar. Desliza hacia abajo para reintentar.
              </Text>
            ) : (
              <Text variant="bodyMedium" style={styles.muted}>
                No se encontraron resultados.
              </Text>
            )}
          </View>
        }
        ListFooterComponent={
          query.isFetchingNextPage ? (
            <View style={{ paddingVertical: 12 }}>
              <ActivityIndicator animating size="small" />
            </View>
          ) : null
        }
      />

      <AdvancedFilterModal
        visible={showAdvancedFilter}
        initialPriceMin={priceMin}
        initialPriceMax={priceMax}
        initialPerPage={perPage}
        initialPriceOption={priceOption}
        onApply={onApplyFilters}
        onClose={() => setShowAdvancedFilter(false)}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0D12', padding: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 48, },
  muted: { color: '#9CA3AF', marginTop: 8 },
  error: { color: '#EF4444' },
});
