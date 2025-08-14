import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
};

export default function SearchBar({ value, onChangeText, onClear }: Props) {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleOpen = () => setExpanded(true);
  const handleClose = () => {
    onClear();
    setExpanded(false);
  };

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  return (
    <View style={styles.wrapper}>
      {!expanded ? (
        <TouchableOpacity style={styles.floatingButton} onPress={handleOpen}>
          <MaterialIcons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            mode="flat"
            placeholder="Buscar (BTC, Ethereum...)"
            textColor="#fff"
            theme={{ colors: { primary: '#22C55E', background: '#0c0e13' } }}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChangeText}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    alignItems: 'flex-end', // botón a la derecha
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // sombra ligera
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 24, // ocupa casi todo el ancho
    backgroundColor: '#0c0e13',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#0c0e13',
  },
  closeButton: {
    padding: 8,
  },
});
