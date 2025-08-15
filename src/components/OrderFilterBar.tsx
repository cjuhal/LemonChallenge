import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SortOrder } from '../services/coingecko';

interface Props {
    initialOrder?: SortOrder;
    initialInclude?: 'top' | 'all';
    onChange: (order: SortOrder, includeTokens: 'top' | 'all') => void;
    onOpenAdvancedFilter: () => void;
}

export default function OrderFilterBar({
    initialOrder = 'market_cap_desc',
    initialInclude = 'top',
    onChange,
    onOpenAdvancedFilter,
}: Props) {
    const [activeOrder, setActiveOrder] = useState<SortOrder>(initialOrder);
    const [includeTokens, setIncludeTokens] = useState<'top' | 'all'>(initialInclude);

    const toggleOrder = () => {
        const next: SortOrder = activeOrder === 'market_cap_desc' ? 'market_cap_asc' : 'market_cap_desc';
        setActiveOrder(next);
    };

    const toggleIncludeTokens = () => {
        setIncludeTokens(prev => (prev === 'top' ? 'all' : 'top'));
    };

    useEffect(() => {
        onChange(activeOrder, includeTokens);
    }, [activeOrder, includeTokens]);

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            <View style={styles.filterRow}>
                <Button
                    mode={includeTokens === 'top' ? 'contained' : 'outlined'}
                    onPress={toggleIncludeTokens}
                    buttonColor="#22C55E"
                    textColor="#fff"
                    style={styles.button}
                >
                    <Text style={styles.textButton}>{includeTokens === 'top' ? 'Top' : 'Todas'}</Text>
                </Button>

                <Button
                    mode={activeOrder.startsWith('market_cap') ? 'contained' : 'outlined'}
                    onPress={toggleOrder}
                    buttonColor="#22C55E"
                    textColor="#fff"
                    style={styles.button}
                >
                    <Text style={styles.textButton}>Market Cap {activeOrder === 'market_cap_desc' ? '↓' : '↑'}</Text>
                </Button>

                <Button
                    mode="outlined"
                    onPress={onOpenAdvancedFilter}
                    textColor="#22C55E"
                    style={styles.button}
                >
                    <Text style={styles.textButton}>Filtro Avanzado</Text>
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    filterRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    button: { marginRight: 8 },
    textButton: { color: '#fff' }
});
