import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, IconButton } from 'react-native-paper';
import { Camera, useCameraDevices, useCodeScanner } from 'react-native-vision-camera';
import { Wallet } from '../store/WalletStore';
import AdressModal from '../components/AdressModal';
import { parseWalletAddress } from '../utils/parsetWalletAdress';

export default function ScannerScreen() {
  const [last, setLast] = useState('');
  const [flash, setFlash] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [modalWallet, setModalWallet] = useState<Wallet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
      if (!parsed) return;

      // Abrir modal con la wallet escaneada
      setModalWallet(parsed);
      setModalVisible(true);
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

      <AdressModal
        visible={modalVisible}
        wallet={modalWallet}
        onClose={() => setModalVisible(false)}
      />
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
