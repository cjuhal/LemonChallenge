import React from 'react';
import { View, StyleSheet, Modal, Image } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useWalletStore, Wallet } from '../store/WalletStore';
import BTC from '@assets/Bitcoin.png';
import ETH from '@assets/Ethereum.png';
import LTC from '@assets/Ltc.png';
import TRX from '@assets/trx.png';
import CoinUnknow from '@assets/coin-unknow.png';

interface Props {
    visible: boolean;
    wallet: Wallet | null;
    onClose: () => void;
}

export default function WalletModal({ visible, wallet, onClose }: Props) {
    const { addWallet, toggleFavorite } = useWalletStore();

    if (!wallet) return null;

    const handleAddFavorite = () => {
        addWallet(wallet);
        toggleFavorite(wallet);
        onClose();
    };

    const getNetworkImage = (network: string) => {
        switch (network) {
            case 'BTC':
                return BTC;
            case 'ETH':
                return ETH;
            case 'LTC':
                return LTC;
            case 'TRX':
                return TRX;
            default:
                return CoinUnknow;
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <Surface style={styles.modal} elevation={6}>
                    <View style={styles.header}>
                        <Text variant="titleLarge" style={styles.title}>
                            {wallet.network} Wallet
                        </Text>
                    </View>

                    <View style={styles.addressContainer}>
                        <Text variant="bodyMedium" numberOfLines={1} ellipsizeMode="middle" style={styles.address}>
                            {wallet.address}
                        </Text>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image source={getNetworkImage(wallet.network)} style={styles.networkImage} resizeMode="contain" />
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
                            buttonColor="#22C55E"
                            textColor="#fff"
                            onPress={handleAddFavorite}
                            style={{ flex: 1, marginRight: 8 }}
                        >
                            Agregar a favoritos
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    modal: {
        width: '100%',
        backgroundColor: '#1F2937', // Dark gray background
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
    header: {
        marginBottom: 12,
    },
    title: {
        color: '#F9FAFB',
        textAlign: 'center',
    },
    addressContainer: {
        backgroundColor: '#111827',
        padding: 12,
        borderRadius: 12,
        marginVertical: 16,
    },
    address: {
        color: '#E5E7EB',
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    networkImage: {
        width: 60,
        height: 60,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
