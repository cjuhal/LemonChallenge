import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Text, IconButton, Surface, Button } from 'react-native-paper';
import { Wallet, useWalletStore } from '../store/WalletStore';
import NetworkImage from './NetworkImage';

interface AddressFavoriteItemProps {
    wallet: Wallet;
}

export default function AddressFavoriteItem({ wallet }: AddressFavoriteItemProps) {
    const removeWallet = useWalletStore(state => state.removeWallet);
    const [visible, setVisible] = useState(false);

    const screenHeight = Dimensions.get('window').height;
    const slideAnim = useState(new Animated.Value(screenHeight))[0];

    const openModal = () => {
        setVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setVisible(false));
    };

    const handleDelete = () => {
        removeWallet(wallet);
        closeModal();
    };

    return (
        <>
            <Surface style={styles.item} elevation={2}>
                <View style={styles.row}>
                    <NetworkImage network={wallet.network} size={48} />

                    <View style={{ flex: 1 }}>
                        <Text style={styles.networkText}>{wallet.network}</Text>
                        <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                            {wallet.address}
                        </Text>
                    </View>

                    <IconButton
                        icon="delete"
                        iconColor="#EF4444"
                        size={24}
                        onPress={openModal}
                    />
                </View>
            </Surface>



            {visible && (
                <Modal visible={visible} transparent animationType="slide">
                    <View style={styles.overlay}>
                        <Surface style={styles.modal} elevation={6}>
                            <Text style={styles.modalTitle}>Eliminar wallet</Text>
                            <Text style={styles.modalText}>
                                ¿Estás seguro que quieres eliminar esta wallet?
                            </Text>
                            <View style={styles.modalButtons}>
                                <Button mode="outlined" onPress={closeModal} style={styles.button} textColor='#fff'>
                                    Cancelar
                                </Button>
                                <Button mode="contained" onPress={handleDelete} style={styles.button} buttonColor="#EF4444">
                                    Eliminar
                                </Button>
                            </View>
                        </Surface>
                    </View>
                </Modal>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    item: {
        marginBottom: 12,
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#0E0F13',
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    networkText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    addressText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#1F2937',
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    button: {
        minWidth: 100,
    },
});
