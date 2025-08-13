import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LoginScreen() {
  const { signIn, initializing } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029' }}
          style={styles.logo}
        />
        <Text style={styles.title}>{'Lemon Challenge'}</Text>
        <Text style={styles.subtitle}>
          {'Iniciá sesión con Google para continuar'}
        </Text>

        <TouchableOpacity style={styles.googleBtn} onPress={signIn} disabled={initializing}>
          <Icon name="logo-google" size={18} color="#111" />
          <Text style={styles.googleText}>{'Continuar con Google'}</Text>
        </TouchableOpacity>

        {initializing && (
          <View style={{ marginTop: 16 }}>
            <ActivityIndicator />
          </View>
        )}
      </View>
      <Text style={styles.footer}>{'Sin Expo • TypeScript • iOS/Android'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E0F13' },
  card: { width: '100%', maxWidth: 420, borderRadius: 16, backgroundColor: '#171922', padding: 24, alignItems: 'center' },
  logo: { width: 80, height: 80, borderRadius: 40, marginBottom: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#9CA3AF', fontSize: 14, textAlign: 'center', marginTop: 6 },
  googleBtn: { marginTop: 20, backgroundColor: '#F3F4F6', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, flexDirection: 'row', gap: 8, alignItems: 'center' },
  googleText: { color: '#111827', fontWeight: '600' },
  footer: { marginTop: 18, color: '#6B7280' },
});