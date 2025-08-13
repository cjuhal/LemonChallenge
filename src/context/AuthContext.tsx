import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { GoogleSignin, statusCodes, User } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

type AuthContextType = {
  user: User | null;
  initializing: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '713991294837-kg52nq7c647d1dho3prumisqhckuu3jf.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    // Intentar reconstruir sesión
    (async () => {
      try {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          const current = await GoogleSignin.getCurrentUser();
          if (current) setUser(current);
        }
      } catch (e) {
        // noop
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();
      setUser(result);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // usuario canceló
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Autenticación', 'Login en progreso…');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services no disponible/actualizado.');
      } else {
        Alert.alert('Error', error?.message ?? 'No se pudo iniciar sesión');
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo cerrar sesión');
    }
  };

  const value = useMemo(() => ({ user, initializing, signIn, signOut }), [user, initializing]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}