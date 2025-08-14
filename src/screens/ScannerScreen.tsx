import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Surface, Text, IconButton } from 'react-native-paper';
import { Camera, useCameraDevices, useCodeScanner } from 'react-native-vision-camera';
import { Wallet } from '../store/WalletStore';
import { parseWalletAddress } from '../utils/parsetWalletAdress';
import AddressModal from '../components/AddressModal';

const { width, height } = Dimensions.get('window');
const SCAN_SIZE = 250; // Tamaño del cuadrado de escaneo

export default function ScannerScreen() {
  const [last, setLast] = useState('');
  const [flash, setFlash] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [modalWallet, setModalWallet] = useState<Wallet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [scanBlocked, setScanBlocked] = useState(false);

  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  const cameraRef = useRef<Camera>(null);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128'],
    onCodeScanned: (codes) => {
      if (!codes?.length) return;
      const value = codes[0].value ?? '';
      if (!value || value === last || scanBlocked) return;

      const parsed = parseWalletAddress(value);
      if (!parsed) return;

      setLast(value);
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

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalWallet(null);
    setScanBlocked(true);
    setTimeout(() => {
      setScanBlocked(false);
      setLast('');
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {/* Cámara */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        ref={cameraRef}
        torch={flash ? 'on' : 'off'}
        codeScanner={codeScanner}
      />

      {/* Overlay opaco con hueco central */}
      <View style={styles.overlay}>
        {/* Fila superior con altura fija */}
        <View style={[styles.overlayRow, { height: 150 }]} />

        {/* Fila central: lados opacos + cuadrado */}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanArea} />
          <View style={styles.sideOverlay} />
        </View>

        {/* Fila inferior ocupa el resto */}
        <View style={[styles.overlayRow, { flex: 1 }]} />
      </View>

      {/* Barra inferior */}
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

      {/* Modal de wallet */}
      <AddressModal
        visible={modalVisible}
        wallet={modalWallet}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },

  // Overlay opaco con hueco
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayRow: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)', // asegúrate de poner el overlay aquí también
  },
  sideOverlay: {
    width: SCAN_SIZE,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanArea: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderWidth: 2,
    borderColor: '#22C55E',
    borderRadius: 12,
  },
  // Barra inferior
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
