import React, { useMemo } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { Wallet, useWalletStore } from '../store/WalletStore';

interface AddressModalProps {
  visible: boolean;
  wallet: Wallet | null;
  onClose: () => void;
}

export default function AddressModal({ visible, wallet, onClose }: AddressModalProps) {
  const toggleFavorite = useWalletStore(state => state.toggleFavorite);
  const favorites = useWalletStore(state => state.favorites);

  const isFavorite = useMemo(() => wallet && favorites.some(f => f.address === wallet.address), [wallet, favorites]);

  if (!wallet) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Surface style={styles.modal} elevation={6}>
          <Text style={styles.modalTitle}>{wallet.address}</Text>
          <Text style={styles.modalText}>
            {isFavorite ? 'Esta wallet es favorita' : 'No es favorita'}
          </Text>
          {!isFavorite && (
            <Button
              mode="contained"
              onPress={() => toggleFavorite(wallet)}
              buttonColor="#22C55E"
            >
              Agregar a favoritos
            </Button>
          )}
          <Button onPress={onClose} style={{ marginTop: 12 }} textColor="#fff">Cerrar</Button>
        </Surface>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', backgroundColor: '#1F2937', borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 8 },
  modalText: { fontSize: 14, color: '#9CA3AF', marginBottom: 20 },
});
