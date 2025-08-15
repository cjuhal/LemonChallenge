import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Modal, Animated, Dimensions } from 'react-native';
import { Surface, Text, IconButton, Button } from 'react-native-paper';
import { Wallet, useWalletStore } from '../store/WalletStore';
import CryptoImage from './CryptoImage';

interface AddressFavoriteItemProps {
  wallet: Wallet;
}

export default function WalletItem({ wallet }: AddressFavoriteItemProps) {
  const removeWallet = useWalletStore(state => state.removeWallet);
  const favorites = useWalletStore(state => state.favorites);
  const toggleFavorite = useWalletStore(state => state.toggleFavorite);

  const [visible, setVisible] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const slideAnim = useState(new Animated.Value(screenHeight))[0];

  const openModal = () => {
    setVisible(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
  };
  const closeModal = () => {
    Animated.timing(slideAnim, { toValue: screenHeight, duration: 200, useNativeDriver: true }).start(() => setVisible(false));
  };
  const handleDelete = () => {
    removeWallet(wallet);
    closeModal();
  };

  const isFavorite = useMemo(() => favorites.some(f => f.address === wallet.address), [favorites]);

  return (
    <>
      <Surface style={styles.item} elevation={2}>
        <View style={styles.row}>
          <CryptoImage symbol={wallet.network} size={48} />
          <View style={{ flex: 1 }}>
            <Text style={styles.networkText}>{wallet.network}</Text>
            <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">{wallet.address}</Text>
          </View>
          <IconButton icon={isFavorite ? 'star' : 'star-outline'} iconColor="#FACC15" size={24} onPress={() => toggleFavorite(wallet)} />
          <IconButton icon="delete" iconColor="#EF4444" size={24} onPress={openModal} />
        </View>
      </Surface>

      {visible && (
        <Modal visible={visible} transparent animationType="slide">
          <View style={styles.overlay}>
            <Surface style={styles.modal} elevation={6}>
              <Text style={styles.modalTitle}>Eliminar wallet</Text>
              <Text style={styles.modalText}>¿Estás seguro que quieres eliminar esta wallet?</Text>
              <View style={styles.modalButtons}>
                <Button mode="contained" onPress={handleDelete} buttonColor="#EF4444">Eliminar</Button>
                <Button mode="outlined" onPress={closeModal} textColor="#fff">Cancelar</Button>
              </View>
            </Surface>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  item: { marginBottom: 12, borderRadius: 12, padding: 12, backgroundColor: '#0E0F13' },
  row: { flexDirection: 'row', alignItems: 'center' },
  networkText: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 2 },
  addressText: { color: '#9CA3AF', fontSize: 14 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { width: '100%', backgroundColor: '#1F2937', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 8 },
  modalText: { fontSize: 14, color: '#9CA3AF', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
});
