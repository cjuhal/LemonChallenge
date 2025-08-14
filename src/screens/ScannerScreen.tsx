import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Surface, Text, IconButton } from 'react-native-paper';
import { Camera, CameraPermissionStatus, useCameraDevices, useCodeScanner } from 'react-native-vision-camera';
function parseWalletAddress(raw: string): { network: string; address: string } | null {
  try {
    const lower = raw.toLowerCase();
    if (lower.startsWith('bitcoin:')) return { network: 'BTC', address: raw.split(':')[1] };
    if (lower.startsWith('ethereum:')) return { network: 'ETH', address: raw.split(':')[1] };
    if (lower.startsWith('litecoin:')) return { network: 'LTC', address: raw.split(':')[1] };
    if (lower.startsWith('tron:')) return { network: 'TRX', address: raw.split(':')[1] };
    if (raw.startsWith('0x') && raw.length >= 26) return { network: 'ETH', address: raw };
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(raw)) return { network: 'BTC', address: raw };
    return { network: 'UNKNOWN', address: raw };
  } catch {
    return null;
  }
}
export default function ScannerScreen() {
  const [last, setLast] = useState('');
  const [flash, setFlash] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  const cameraRef = useRef<Camera>(null);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128'],
    onCodeScanned: (codes) => {
      if (!codes?.length) return;
      const value = codes[0].value ?? '';
      if (!value || value === last) return;
      setLast(value);

      const parsed = parseWalletAddress(value);
      if (!parsed) {
        Alert.alert('QR inválido', 'No se reconoce una dirección de wallet.');
        return;
      }
      Alert.alert('Wallet detectada', `${parsed.network}: ${parsed.address}`);
    },
  });

  useEffect(() => {
    (async () => {
      const status = await Camera.getCameraPermissionStatus();
      if (status !== 'granted') {
        const newStatus = await Camera.requestCameraPermission();
        setHasPermission(newStatus === 'granted');
      } else {
        setHasPermission(true);
      }
    })();
  }, []);

  if (!device || !hasPermission) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Cámara no disponible o sin permisos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        ref={cameraRef}
        torch={flash ? 'on' : 'off'}
        codeScanner={codeScanner}
      />

      <Surface style={styles.overlayBottom} elevation={4}>
        <Text variant="titleMedium" style={styles.help}>
          Apunta el QR de la wallet para escanear
        </Text>
        <IconButton
          icon={flash ? 'flash' : 'flash-off'}
          size={28}
          iconColor="#22C55E"
          onPress={() => setFlash(!flash)}
          style={styles.flashButton}
        />
      </Surface>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  overlayBottom: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  help: { color: '#fff', flex: 1, textAlign: 'center' },
  flashButton: { margin: 0 },
});
