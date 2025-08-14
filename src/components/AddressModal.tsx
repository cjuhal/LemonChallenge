import React, { useState } from 'react';
import { View, StyleSheet, Modal, Image, TouchableOpacity, Clipboard } from 'react-native';
import { Text, Button, Surface, IconButton } from 'react-native-paper';
import { useWalletStore, Wallet } from '../store/WalletStore';
import NetworkImage from './NetworkImage';

interface Props {
    visible: boolean;
    wallet: Wallet | null;
    onClose: () => void;
}
export default function AddressModal({ visible, wallet, onClose }: Props) {
    const [showAddress, setShowAddress] = useState(false);

    const addWallet = useWalletStore(state => state.addWallet);
    const toggleFavorite = useWalletStore(state => state.toggleFavorite);
    const favorites = useWalletStore(state => state.favorites);

    if (!wallet) return null;

    const isFavorite = favorites.some(f => f.address === wallet.address); // <- checkeo

    const handleAddFavorite = () => {
        if (!isFavorite) toggleFavorite(wallet);
        addWallet(wallet); // opcional: siempre agregamos al historial
        onClose();
    };

    const copyToClipboard = () => {
        Clipboard.setString(wallet.address);
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <Surface style={styles.modal} elevation={6}>
                    <View style={styles.header}>
                        <Text variant="titleLarge" style={styles.title}>
                            {wallet.network} Wallet
                        </Text>
                    </View>

                    <View style={styles.imageContainer}>
                        <NetworkImage network={wallet.network} size={48} />
                    </View>

                    <View style={styles.addressRow}>
                        <Text
                            variant="bodyMedium"
                            style={styles.address}
                            numberOfLines={showAddress ? undefined : 1}
                            ellipsizeMode="middle"
                        >
                            {wallet.address}
                        </Text>

                        <View style={styles.addressButtons}>
                            <IconButton
                                icon={showAddress ? 'eye-off' : 'eye'}
                                size={24}
                                iconColor="#F9FAFB"
                                onPress={() => setShowAddress(!showAddress)}
                            />
                            <IconButton
                                icon="content-copy"
                                size={24}
                                iconColor="#F9FAFB"
                                onPress={copyToClipboard}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Button
                            mode="outlined"
                            buttonColor="#1F2937"
                            textColor="#F9FAFB"
                            onPress={onClose}
                            style={{ flex: 1 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            mode="contained"
                            disabled={false} // no usar disabled para no perder color
                            buttonColor={isFavorite ? '#9CA3AF' : '#22C55E'}
                            textColor="#fff"
                            onPress={isFavorite ? undefined : handleAddFavorite} // deshabilita acción
                            style={{ flex: 1, marginLeft: 8 }}
                        >
                            {isFavorite ? 'Ya es favorito' : 'Agregar a favoritos'}
                        </Button>
                    </View>
                </Surface>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        width: '100%',
        backgroundColor: '#1F2937',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: -4 },
        shadowRadius: 6,
    },
    header: { marginBottom: 12 },
    title: { color: '#F9FAFB', textAlign: 'center' },
    imageContainer: { alignItems: 'center', marginBottom: 16 },
    networkImage: { width: 60, height: 60 },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#111827',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    address: { color: '#E5E7EB', flex: 1 },
    addressButtons: { flexDirection: 'row' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
});
