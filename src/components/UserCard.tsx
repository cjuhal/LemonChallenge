import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Surface, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import Icon from 'react-native-vector-icons/Ionicons';

export default function UserCard() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
    } catch (e: any) {
      setErrorMessage(e?.message ?? 'No se pudo cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Surface style={styles.card} elevation={6}>
      <View style={styles.row}>
        {/* Avatar */}
        <Image source={{ uri: user?.user?.photo ?? '' }} style={styles.avatar} />

        {/* Info */}
        <View style={styles.info}>
          <Text variant="headlineSmall" style={styles.name}>{user?.user?.name}</Text>
          <Text variant="bodySmall" style={styles.email}>{user?.user?.email}</Text>
        </View>

        {/* Logout Icon */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
          {loading ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Icon name="log-out-outline" size={24} color="#EF4444" />
          )}
        </TouchableOpacity>
      </View>

      {/* Snackbar para errores */}
      <Snackbar
        visible={!!errorMessage}
        onDismiss={() => setErrorMessage(null)}
        duration={4000}
        style={{ backgroundColor: '#EF4444' }}
      >
        {errorMessage}
      </Snackbar>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 68, // altura máxima
    borderRadius: 16,
    paddingHorizontal: 12,
    backgroundColor: '#1F2937',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
  },
  info: {
    flex: 1,
    marginHorizontal: 12,
    justifyContent: 'center',
  },
  name: { color: '#fff', fontWeight: '700' },
  email: { color: '#9CA3AF', marginTop: 2 },
  logoutIcon: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
