import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button, Text, Surface, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '@assets/logo.png';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signIn(); // devuelve User | null
      if (!result) {
        setError('No se inició sesión con Google.');
      }
    } catch (err) {
      console.error('Error Google Sign-In:', err);
      setError('Hubo un problema al iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => setError(null);

  return (
    <View style={styles.container}>
      <Surface style={styles.card} elevation={6}>
        <View style={styles.content}>
          <Image source={Logo} style={styles.logo} />
          <View style={{ alignItems: 'center' }}>
            <Text variant="headlineMedium" style={styles.title}>
              Pinapple Cash
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Iniciá sesión con Google para continuar
            </Text>
          </View>

          <Button
            mode="contained"
            icon={() => <Icon name="logo-google" size={20} color="#111" />}
            onPress={handleGoogleSignIn}
            disabled={loading}
            style={styles.googleBtn}
            contentStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50 }}
            labelStyle={styles.googleText}
          >
            Continuar con Google
          </Button>
        </View>
      </Surface>

      <Text variant="bodySmall" style={styles.footer}>
        Christian Juhal - Lemon Challenge 2025
      </Text>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      )}

      {/* Error Overlay */}
      {error && (
        <View style={styles.errorOverlay}>
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Button mode="contained" onPress={handleCloseError} style={{ marginTop: 16 }}>
              Cerrar
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E0F13', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { flex: 1, width: '100%', maxWidth: 420, borderRadius: 20, padding: 32, backgroundColor: '#171922', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
  content: { flex: 1, justifyContent: 'space-around', alignItems: 'center' },
  logo: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  title: { color: '#fff', fontWeight: '700' },
  subtitle: { color: '#9CA3AF', textAlign: 'center', marginTop: 8 },
  googleBtn: { marginTop: 24, backgroundColor: '#F3F4F6', borderRadius: 12, width: '100%', maxWidth: 300 },
  googleText: { color: '#111827', fontWeight: '600', fontSize: 16 },
  footer: { marginTop: 16, color: '#6B7280', textAlign: 'center' },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBox: {
    backgroundColor: '#1F2937',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  errorText: { color: '#F87171', textAlign: 'center', fontSize: 16, fontWeight: '600' },
});
