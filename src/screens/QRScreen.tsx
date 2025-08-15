import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { Camera, useCameraDevices, useCodeScanner } from 'react-native-vision-camera';
import { Wallet, useWalletStore } from '../store/WalletStore';
import { parseWalletAddress } from '../utils/parsetWalletAdress';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');
const SCAN_SIZE = 250;

type NavProp = NativeStackNavigationProp<RootStackParamList, 'WalletDetail'>;

export default function QRScreen() {
  const [last, setLast] = useState('');
  const [flash, setFlash] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [scanBlocked, setScanBlocked] = useState(false);

  const addWallet = useWalletStore(state => state.addWallet);
  const history = useWalletStore(state => state.history);

  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  const cameraRef = useRef<Camera>(null);

  const navigation = useNavigation<NavProp>();

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128'],
    onCodeScanned: (codes) => {
      if (!codes?.length || scanBlocked) return;
      const value = codes[0].value ?? '';
      if (!value || value === last) return;

      const parsed = parseWalletAddress(value);
      if (!parsed) return;

      setLast(value);

      const exists = history.find(w => w.address === parsed.address);
      if (!exists) {
        addWallet(parsed);
      }

      setScanBlocked(true);
      navigation.navigate('WalletDetail', { wallet: parsed, exists: !!exists });

      setTimeout(() => {
        setScanBlocked(false);
        setLast('');
      }, 3000);
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

      <View style={styles.overlay}>
        <View style={[styles.overlayRow, { height: 150 }]} />
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanArea} />
          <View style={styles.sideOverlay} />
        </View>
        <View style={[styles.overlayRow, { flex: 1 }]} />
      </View>

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
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  overlayRow: { width: '100%', backgroundColor: 'rgba(0,0,0,0.6)' },
  sideOverlay: { width: SCAN_SIZE, backgroundColor: 'rgba(0,0,0,0.6)' },
  scanArea: { width: SCAN_SIZE, height: SCAN_SIZE, borderWidth: 2, borderColor: '#22C55E', borderRadius: 12 },
  overlayBottom: { position: 'absolute', bottom: 24, left: 16, right: 16, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.6)', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  help: { color: '#fff', flex: 1, textAlign: 'center' },
  flashButton: { margin: 0 },
});
