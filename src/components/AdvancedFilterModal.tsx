import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Modal,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Button, RadioButton, Text, Menu, Provider } from 'react-native-paper';

export type PriceFilterOption = 'all' | 'positive' | 'negative';

export interface AdvancedFilterProps {
    visible: boolean;
    initialPriceMin?: number;
    initialPriceMax?: number;
    initialPerPage?: number;
    initialPriceOption?: PriceFilterOption;
    onApply: (filters: {
        priceMin?: number;
        priceMax?: number;
        perPage?: number;
        priceOption?: PriceFilterOption;
    }) => void;
    onClose: () => void;
}

export default function AdvancedFilterModal({
    visible,
    initialPriceMin,
    initialPriceMax,
    initialPerPage = 50,
    initialPriceOption = 'all',
    onApply,
    onClose,
}: AdvancedFilterProps) {
    const [priceMin, setPriceMin] = useState<string>(initialPriceMin?.toString() ?? '');
    const [priceMax, setPriceMax] = useState<string>(initialPriceMax?.toString() ?? '');
    const [perPage, setPerPage] = useState<number>(initialPerPage);
    const [priceOption, setPriceOption] = useState<PriceFilterOption>(initialPriceOption);

    const handleApply = () => {
        onApply({
            priceMin: priceMin ? Number(priceMin) : undefined,
            priceMax: priceMax ? Number(priceMax) : undefined,
            perPage,
            priceOption,
        });
        onClose();
    };

    return (
        <Provider>
            <Modal visible={visible} animationType="slide" transparent>
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardAvoid}
                >
                    <View style={styles.container}>
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 24 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Text variant="titleMedium" style={styles.title}>
                                Filtro Avanzado
                            </Text>

                            <Text style={styles.label}>Precio mínimo</Text>
                            <TextInput
                                style={styles.input}
                                value={priceMin}
                                keyboardType="numeric"
                                onChangeText={setPriceMin}
                                placeholder="Ej: 0"
                                placeholderTextColor="#9CA3AF"
                            />

                            <Text style={styles.label}>Precio máximo</Text>
                            <TextInput
                                style={styles.input}
                                value={priceMax}
                                keyboardType="numeric"
                                onChangeText={setPriceMax}
                                placeholder="Ej: 1000"
                                placeholderTextColor="#9CA3AF"
                            />

                            <Text style={styles.label}>Cantidad por página</Text>
                            <RadioButton.Group onValueChange={(v) => setPerPage(Number(v))} value={perPage.toString()}>
                                <View style={styles.columnRadio}>
                                    {[50, 100, 300].map((v) => (
                                        <RadioButton.Item
                                            key={v}
                                            label={v.toString()}
                                            value={v.toString()}
                                            color="#22C55E"
                                            labelStyle={styles.radioLabel}
                                        />
                                    ))}
                                </View>
                            </RadioButton.Group>

                            <Text style={styles.label}>Últimas 24hs</Text>
                            <RadioButton.Group
                                onValueChange={setPriceOption} value={priceOption}>
                                <View style={styles.columnRadio}>
                                    <RadioButton.Item
                                        label="Todos"
                                        value="all"
                                        labelStyle={styles.radioLabel}
                                        color="#22C55E"
                                    />
                                    <RadioButton.Item
                                        label="Positivos"
                                        value="positive"
                                        labelStyle={styles.radioLabel}
                                        color="#22C55E"
                                    />
                                    <RadioButton.Item
                                        label="Negativos"
                                        value="negative"
                                        labelStyle={styles.radioLabel}
                                        color="#22C55E"
                                    />
                                </View>
                            </RadioButton.Group>

                            <View style={styles.buttonRow}>
                                <Button
                                    mode="contained"
                                    onPress={handleApply}
                                    style={styles.actionButton}
                                    buttonColor="#22C55E"
                                    textColor="#fff"
                                >
                                    Aplicar
                                </Button>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </Provider>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: '#00000077',
    },
    keyboardAvoid: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    container: {
        width: '100%',
        backgroundColor: '#0E0F13',
        padding: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        maxHeight: '90%',
    },
    title: { color: '#fff', marginBottom: 12 },
    label: { color: '#9CA3AF', marginTop: 12 },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        padding: 12,
        borderRadius: 6,
        marginTop: 4,
        fontSize: 16,
    },
    rowPerPage: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        justifyContent: 'space-between',
    },
    perPageButton: {
        flex: 1,
        margin: 4,
        minHeight: 48,
        justifyContent: 'center',
    },
    columnRadio: { flexDirection: 'column', marginTop: 8 },
    radioLabel: { color: '#fff' },
    buttonRow: { flexDirection: 'row', marginTop: 16, justifyContent: 'flex-end' },
    actionButton: { flex: 1, minHeight: 48, justifyContent: 'center' },
});
