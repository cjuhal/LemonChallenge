import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { useWalletStore } from '../store/WalletStore';
import { shallow } from 'zustand/shallow';

export default function AdressFavoriteList() {
    const { history, favorites, toggleFavorite, removeWallet, loadWallets } = useWalletStore(
        state => ({
            history: state.history,
            favorites: state.favorites,
            toggleFavorite: state.toggleFavorite,
            removeWallet: state.removeWallet,
            loadWallets: state.loadWallets,
        }),
        shallow
    );

    const [loaded, setLoaded] = React.useState(false);

    useEffect(() => {
        if (!loaded) {
            loadWallets().finally(() => setLoaded(true));
        }
    }, [loaded, loadWallets]);

    // === LOGS PARA DEBUG ===
    useEffect(() => {
        console.log('History:', JSON.stringify(history, null, 2));
        console.log('Favorites:', JSON.stringify(favorites, null, 2));
    }, [history, favorites]);
    // ======================

    const renderItem = ({ item, index }: { item: { network: string; address: string }; index: number }) => {
        const isFav = favorites.some(f => f.address === item.address);

        return (
            <Surface style={styles.item} elevation={2} key={`${item.network}_${item.address}_${index}`}>
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text variant="titleMedium">{item.network}</Text>
                        <Text variant="bodyMedium" numberOfLines={1} ellipsizeMode="middle">
                            {item.address}
                        </Text>
                    </View>

                    <IconButton
                        icon={isFav ? 'star' : 'star-outline'}
                        iconColor="#FFD700"
                        onPress={() => toggleFavorite(item)}
                    />

                    <IconButton
                        icon="delete"
                        iconColor="#EF4444"
                        onPress={() =>
                            Alert.alert('Eliminar wallet', '¿Estás seguro que quieres eliminar esta wallet?', [
                                { text: 'Cancelar', style: 'cancel' },
                                { text: 'Eliminar', style: 'destructive', onPress: () => removeWallet(item) },
                            ])
                        }
                    />
                </View>
            </Surface>
        );
    };

    return (
        <FlatList
            data={history}
            keyExtractor={(item, index) => `${item.network}_${item.address}_${index}`} // combinación única + index
            renderItem={renderItem}
            extraData={favorites} // asegura re-render cuando cambian favoritos
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
                <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay wallets escaneadas</Text>
            }
        />
    );
}

const styles = StyleSheet.create({
    item: {
        marginBottom: 12,
        borderRadius: 12,
        padding: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
