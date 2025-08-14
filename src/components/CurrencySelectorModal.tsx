import React from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableWithoutFeedback
} from "react-native";
import CryptoImage from "./CryptoImage";
import FiatImage from "./FiatImage";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  data: Array<{ id: string; symbol: string }>;
  onSelect: (item: any) => void;
  type: "crypto" | "fiat"; // <-- nuevo prop
}

export default function CurrencySelectorModal({
  visible,
  onDismiss,
  data,
  onSelect,
  type
}: Props) {
  const renderImage = (symbol: string) => {
    return type === "crypto" ? (
      <CryptoImage symbol={symbol} size={28} />
    ) : (
      <FiatImage symbol={symbol} size={28} />
    );
  };

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
        <FlatList
          data={data}
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
              <Text style={styles.text}>{item.symbol}</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContainer: {
    backgroundColor: "#0E0F13",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "60%"
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12
  },
  text: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8
  },
  divider: {
    height: 1,
    backgroundColor: "#222"
  }
});
