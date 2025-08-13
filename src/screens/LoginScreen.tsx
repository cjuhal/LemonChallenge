import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Dimensions  } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button, Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '@assets/logo.png';

const screenHeight = Dimensions.get('window').height;

export default function LoginScreen() {
  const { signIn, initializing } = useAuth();

  return (
    <View style={styles.container}>
      <Surface style={[styles.card, { height: screenHeight * 0.75 }]} elevation={4}>
        <Image
          source={Logo}
          style={styles.logo}
        />
        <Text variant="headlineMedium" style={styles.title}>
          Pinapple Cash
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Iniciá sesión con Google para continuar
        </Text>

        <Button
          mode="contained"
          icon={() => <Icon name="logo-google" size={18} color="#111" />}
          onPress={signIn}
          disabled={initializing}
          style={styles.googleBtn}
          contentStyle={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          labelStyle={styles.googleText}
        >
          Continuar con Google
        </Button>

        {initializing && (
          <ActivityIndicator style={{ marginTop: 16 }} />
        )}
      </Surface>
      <Text variant="bodySmall" style={styles.footer}>
        Christian Juhal - Lemon Challenge 2025
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E0F13',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    backgroundColor: '#171922',
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    width: 80, height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontWeight: '700',
  },
  subtitle: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 6,
  },
  googleBtn: {
    marginTop: 20,
    backgroundColor: '#F3F4F6',
  },
  googleText: {
    color: '#111827',
    fontWeight: '600',
  },
  footer: {
    marginTop: 18,
    color: '#6B7280',
  },
});