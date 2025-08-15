import React from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import CryptoImage from "./CryptoImage";
import FiatImage from "./FiatImage";
import { useQuery } from "@tanstack/react-query";
import { fetchMarkets } from "../services/coingecko";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  data: Array<{ id: string; symbol: string }>;
  onSelect: (item: any) => void;
  type: "crypto" | "fiat";
}

export default function CurrencySelectorModal({
  visible,
  onDismiss,
  data,
  onSelect,
  type,
}: Props) {
  // Solo traemos precios para cryptos (para fiats podrías simular o traer de otra API)
  const { data: marketData, isLoading, isError } = useQuery({
    queryKey: ["marketData", type],
    queryFn: () =>
      type === "crypto"
        ? fetchMarkets({
            vs_currency: "usd",
            page: 1,
            per_page: 50,
            order: "market_cap_desc",
          })
        : Promise.resolve([]),
    refetchInterval: 15000, // refresca cada 15s
    enabled: visible, // solo carga cuando el modal está visible
  });

  const renderImage = (symbol: string) => {
    return type === "crypto" ? (
      <CryptoImage symbol={symbol} size={28} />
    ) : (
      <FiatImage symbol={symbol} size={28} />
    );
  };

  // Mapear datos para mostrar precio y variación
  const enrichedData =
    type === "crypto" && marketData
      ? data.map((item) => {
          const marketInfo = marketData.find((m) => m.symbol.toLowerCase() === item.symbol.toLowerCase());
          return {
            ...item,
            current_price: marketInfo?.current_price ?? null,
            price_change_percentage_24h: marketInfo?.price_change_percentage_24h ?? null,
          };
        })
      : data.map((item) => ({
          ...item,
          current_price: null,
          price_change_percentage_24h: null,
        }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        {isLoading && <ActivityIndicator color="#22C55E" style={{ marginVertical: 10 }} />}
        {isError && <Text style={{ color: "red", marginBottom: 8 }}>Error al cargar precios</Text>}

        <FlatList
          data={enrichedData}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onSelect(item);
              }}
            >
              {renderImage(item.symbol)}
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.symbol}>{item.symbol}</Text>
                {item.current_price !== null && (
                  <Text style={styles.price}>USD{item.current_price.toLocaleString()}</Text>
                )}
              </View>
              {item.price_change_percentage_24h !== null && (
                <Text
                  style={[
                    styles.change,
                    {
                      color:
                        item.price_change_percentage_24h > 0
                          ? "#22C55E"
                          : "#EF4444",
                    },
                  ]}
                >
                  {item.price_change_percentage_24h.toFixed(2)}%
                </Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#0E0F13",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "60%",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  symbol: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    color: "#ccc",
    fontSize: 14,
  },
  change: {
    fontSize: 14,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#222",
  },
});
