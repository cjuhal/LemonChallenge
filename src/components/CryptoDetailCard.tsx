import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  data: any;
  fiatSymbol: string;
};

export default function CryptoDetailsCard({ data, fiatSymbol }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: data.image }} style={styles.image} />
        <View>
          <Text style={styles.name}>
            {data.name} ({data.symbol.toUpperCase()})
          </Text>
          <Text style={styles.price}>
            {fiatSymbol.toUpperCase()} {data.current_price}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.change,
          { color: data.price_change_percentage_24h >= 0 ? "#22C55E" : "#EF4444" },
        ]}
      >
        24h: {data.price_change_percentage_24h.toFixed(2)}%
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Máx 24h:</Text>
        <Text style={styles.value}>
          {fiatSymbol.toUpperCase()} {data.high_24h}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Mín 24h:</Text>
        <Text style={styles.value}>
          {fiatSymbol.toUpperCase()} {data.low_24h}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Market Cap:</Text>
        <Text style={styles.value}>
          {fiatSymbol.toUpperCase()} {data.market_cap.toLocaleString()}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Volumen 24h:</Text>
        <Text style={styles.value}>
          {fiatSymbol.toUpperCase()} {data.total_volume.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1B1F",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  image: { width: 40, height: 40, marginRight: 10 },
  name: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  price: { color: "#fff", fontSize: 14 },
  change: { fontSize: 14, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#aaa" },
  value: { color: "#fff" },
});
