import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { GoogleSignin, statusCodes, User } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

type AuthContextType = {
  user: User | any | null;
  initializing: boolean;
  signIn: () => Promise<User | null>;
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

    const restoreSession = async () => {
      try {
        const currentUser = await GoogleSignin.signInSilently();
        if (currentUser) setUser(currentUser);
      } catch (e) {
        console.log('No hay sesión activa:', e);
      } finally {
        setInitializing(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (): Promise<User | null> => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();
      if (!result) return null;
      setUser(result?.data);
      return result;
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) return null;
      else if (error.code === statusCodes.IN_PROGRESS) Alert.alert('Autenticación', 'Login en progreso…');
      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) Alert.alert('Error', 'Google Play Services no disponible/actualizado.');
      else Alert.alert('Error', error?.message ?? 'No se pudo iniciar sesión');
      return null;
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
