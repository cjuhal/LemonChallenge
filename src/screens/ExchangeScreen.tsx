import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Text, TextInput, IconButton } from "react-native-paper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPrice, getCryptoDetails } from "../services/coingecko";
import CryptoImage from "../components/CryptoImage";
import FiatImage from "../components/FiatImage";
import CurrencySelectorModal from "../components/CurrencySelectorModal";
import CryptoDetailsCard from "../components/CryptoDetailCard";

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
  const queryClient = useQueryClient();

  const [fromCurrency, setFromCurrency] = useState(cryptos[0]);
  const [toCurrency, setToCurrency] = useState(fiats[0]);
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectingField, setSelectingField] = useState<"from" | "to">("from");

  const [fromType, setFromType] = useState<"crypto" | "fiat">("crypto");
  const [toType, setToType] = useState<"crypto" | "fiat">("fiat");

  const lastEdited = useRef<"from" | "to">("from");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Query para precio
  const {
    data: price,
    isLoading: priceLoading,
    isError: priceError,
    refetch: refetchPrice,
  } = useQuery({
    queryKey: ["price", fromCurrency.id, toCurrency.id],
    queryFn: async () => {
      if (!fromCurrency?.symbol || !toCurrency?.symbol) throw new Error("Monedas incompletas");

      setErrorMessage(null);
      let cryptoSymbol: string, fiatSymbol: string, invert: boolean;

      if (fromType === "crypto" && toType === "fiat") {
        cryptoSymbol = fromCurrency.symbol.toLowerCase();
        fiatSymbol = toCurrency.symbol.toLowerCase();
        invert = false;
      } else if (fromType === "fiat" && toType === "crypto") {
        cryptoSymbol = toCurrency.symbol.toLowerCase();
        fiatSymbol = fromCurrency.symbol.toLowerCase();
        invert = true;
      } else {
        throw new Error("La API solo soporta crypto ↔ fiat");
      }

      const result = await getPrice(cryptoSymbol, fiatSymbol);
      return invert ? 1 / result : result;
    },
    enabled: false,
    staleTime: 15000,
    refetchOnWindowFocus: false,
    refetchInterval: 15000,
    onError: () => setErrorMessage("Error de la consulta"),
  });

  // Query para detalles
  const {
    data: cryptoData,
    isLoading: detailsLoading,
    isError: detailsError,
    refetch: refetchDetails,
  } = useQuery({
    queryKey: [
      "cryptoDetails",
      fromType === "crypto" ? fromCurrency.symbol : toCurrency.symbol,
      toCurrency.symbol,
    ],
    queryFn: async () => {
      if (!fromCurrency?.symbol || !toCurrency?.symbol) throw new Error("Monedas incompletas");

      setErrorMessage(null);
      const symbol = fromType === "crypto" ? fromCurrency.symbol : toCurrency.symbol;
      const vsCurrency = fromType === "crypto" ? toCurrency.symbol : fromCurrency.symbol;

      const data = await getCryptoDetails({
        symbol: symbol.toLowerCase(),
        vs_currency: vsCurrency.toLowerCase(),
      });

      return data;
    },
    enabled: false,
    refetchInterval: 15000,
    onError: () => setErrorMessage("Error de la consulta"),
  });

  // Actualizar conversión
  useEffect(() => {
    if (price) {
      if (lastEdited.current === "from" && fromAmount) {
        setToAmount((parseFloat(fromAmount) * price).toFixed(6));
      } else if (lastEdited.current === "to" && toAmount) {
        setFromAmount((parseFloat(toAmount) / price).toFixed(6));
      }
    }
  }, [price]);

  // Refetch cuando cambian las monedas, solo si hay símbolos válidos
  useEffect(() => {
    if (fromCurrency?.symbol && toCurrency?.symbol) {
      setFromAmount("");
      setToAmount("");
      refetchPrice();
      refetchDetails();
    }
  }, [fromCurrency, toCurrency]);

  const handleFromAmountChange = (value: string) => {
    lastEdited.current = "from";
    setFromAmount(value);
    if (!value) {
      setToAmount("");
      return;
    }
    if (price) {
      setToAmount((parseFloat(value) * price).toFixed(6));
    } else {
      refetchPrice();
    }
  };

  const handleToAmountChange = (value: string) => {
    lastEdited.current = "to";
    setToAmount(value);
    if (!value) {
      setFromAmount("");
      return;
    }
    if (price) {
      setFromAmount((parseFloat(value) / price).toFixed(6));
    } else {
      refetchPrice();
    }
  };

  const handleSelectCurrency = (currency) => {
    if (selectingField === "from") setFromCurrency(currency);
    else setToCurrency(currency);

    setFromAmount("");
    setToAmount("");
    setErrorMessage(null);
    queryClient.removeQueries({ queryKey: ["price"] });
    queryClient.removeQueries({ queryKey: ["cryptoDetails"] });
    setModalVisible(false);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);

    const tempType = fromType;
    setFromType(toType);
    setToType(tempType);
  };

  const isLoading = priceLoading || detailsLoading;
  const hasError = priceError || detailsError || !!errorMessage;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cambiar ({fromCurrency.symbol})</Text>
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

      <IconButton
        icon="swap-vertical"
        size={28}
        style={styles.swapButton}
        onPress={swapCurrencies}
        iconColor="#22C55E"
      />

      <Text style={styles.label}>Recibir ({toCurrency.symbol})</Text>
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

      {cryptoData && !detailsLoading && (
        <CryptoDetailsCard
          data={cryptoData}
          fiatSymbol={fromType === "crypto" ? toCurrency.symbol : fromCurrency.symbol}
        />
      )}

      {isLoading && <ActivityIndicator color="#22C55E" />}
      {hasError && (
        <Text style={{ color: "red", marginBottom: 8 }}>
          {errorMessage || "Error de la consulta"}
        </Text>
      )}

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
  label: { color: "#fff", fontSize: 14, marginBottom: 6 },
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
