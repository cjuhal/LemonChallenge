import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Animated } from 'react-native';
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
  const animation = useRef(new Animated.Value(0)).current;

  const handleOpen = () => {
    setExpanded(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleClose = () => {
    onClear();
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setExpanded(false));
  };

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const inputWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [48, Dimensions.get('window').width - 16],
  });

  return (
    <View style={styles.wrapper}>
      {!expanded ? (
        <TouchableOpacity style={styles.floatingButton} onPress={handleOpen}>
          <MaterialIcons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <Animated.View style={[styles.inputContainer, { width: inputWidth }]}>
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
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c0e13',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 48,
  },
  input: {
    flex: 1,
    backgroundColor: '#0c0e13',
  },
  closeButton: {
    padding: 8,
  },
});
