import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, IconButton } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { getPrice } from "../services/coingecko";
import CryptoImage from "../components/CryptoImage";
import FiatImage from "../components/FiatImage";
import CurrencySelectorModal from "../components/CurrencySelectorModal";

// Listas de monedas
const cryptos = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "litecoin", symbol: "LTC" },
  { id: "tron", symbol: "TRX" },
];

const fiats = [
  { id: "ars", symbol: "ARS" },
  { id: "usd", symbol: "USD" },
  { id: "pen", symbol: "PEN" },
  { id: "eur", symbol: "EUR" },
];

export default function ExchangeScreen() {
  const [fromCurrency, setFromCurrency] = useState(cryptos[0]);
  const [toCurrency, setToCurrency] = useState(fiats[0]);
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectingField, setSelectingField] = useState<"from" | "to">("from");

  // Tipos de cada fila
  const [fromType, setFromType] = useState<"crypto" | "fiat">("crypto");
  const [toType, setToType] = useState<"crypto" | "fiat">("fiat");

  const { data: price, refetch } = useQuery({
    queryKey: ["price", fromCurrency.id, toCurrency.id],
    queryFn: () =>
      getPrice(
        fromType === "crypto" ? fromCurrency.id : toCurrency.id,
        toType === "fiat" ? toCurrency.symbol.toLowerCase() : fromCurrency.symbol.toLowerCase()
      ),
    enabled: false,
  });

  // Calcular al cambiar monto o precio
  useEffect(() => {
    if (price && fromAmount) {
      setToAmount((parseFloat(fromAmount) * price).toFixed(6));
    }
  }, [price, fromAmount]);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      refetch();
    }
  }, [fromCurrency, toCurrency]);

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (price) setToAmount((parseFloat(value || "0") * price).toFixed(6));
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    if (price) setFromAmount((parseFloat(value || "0") / price).toFixed(6));
  };

  const handleSelectCurrency = (currency) => {
    if (selectingField === "from") setFromCurrency(currency);
    else setToCurrency(currency);
    setModalVisible(false);
  };

  // Swap de monedas y tipos
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);

    const tempType = fromType;
    setFromType(toType);
    setToType(tempType);
  };

  return (
    <View style={styles.container}>
      {/* Fila 1 */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.currencySelector}
          onPress={() => {
            setSelectingField("from");
            setModalVisible(true);
          }}
        >
          {fromType === "crypto" ? (
            <CryptoImage symbol={fromCurrency.symbol} size={32} />
          ) : (
            <FiatImage symbol={fromCurrency.symbol} size={32} />
          )}
          <Text style={styles.currencyText}>{fromCurrency.symbol}</Text>
        </TouchableOpacity>
        <TextInput
          mode="outlined"
          value={fromAmount}
          onChangeText={handleFromAmountChange}
          keyboardType="numeric"
          style={styles.input}
          outlineColor="#222"
          textColor="#fff"
        />
      </View>

      {/* Botón swap */}
      <IconButton
        icon="swap-vertical"
        size={28}
        style={styles.swapButton}
        onPress={swapCurrencies}
        iconColor="#22C55E"
      />

      {/* Fila 2 */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.currencySelector}
          onPress={() => {
            setSelectingField("to");
            setModalVisible(true);
          }}
        >
          {toType === "crypto" ? (
            <CryptoImage symbol={toCurrency.symbol} size={32} />
          ) : (
            <FiatImage symbol={toCurrency.symbol} size={32} />
          )}
          <Text style={styles.currencyText}>{toCurrency.symbol}</Text>
        </TouchableOpacity>
        <TextInput
          mode="outlined"
          value={toAmount}
          onChangeText={handleToAmountChange}
          keyboardType="numeric"
          style={styles.input}
          outlineColor="#222"
          textColor="#fff"
        />
      </View>

      {/* Modal */}
      <CurrencySelectorModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        data={
          selectingField === "from"
            ? fromType === "crypto"
              ? cryptos
              : fiats
            : toType === "crypto"
            ? cryptos
            : fiats
        }
        type={selectingField === "from" ? fromType : toType}
        onSelect={handleSelectCurrency}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0E0F13" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#222",
    borderRadius: 8,
    marginRight: 8,
  },
  currencyText: { color: "#fff", fontSize: 16, marginLeft: 8 },
  input: { flex: 1, backgroundColor: "#0E0F13" },
  swapButton: { alignSelf: "center", marginBottom: 16 },
});
