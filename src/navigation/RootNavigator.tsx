import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import MarketsScreen from '../screens/MarketsScreen';
import SearchBar from '../components/SearchBar';
import { useMarketStore } from '../store/MarketStore';
import ExchangeScreen from '../screens/ExchangeScreen';
import WalletListScreen from '../screens/WalletListScreen';
import QRScreen from '../screens/QRScreen';
import { Wallet } from '../store/WalletStore';
import WalletDetailScreen from '../screens/WalletDetailScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  WalletDetail: {
    wallet: Wallet;
    exists: boolean;
  };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();



function MainTabs() {

  const searchText = useMarketStore(state => state.searchText);
  const setSearchText = useMarketStore(state => state.setSearchText);
  const clearSearch = useMarketStore(state => state.clearSearch);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'left',
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, string> = {
            Market: 'trending-up',
            Exchange: 'swap-horizontal',
            QR: 'qr-code',
            Wallets: 'wallet',
          };
          const name = map[route.name] ?? 'ellipse';
          return <Icon name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Market"
        component={MarketsScreen}
        options={{
          title: 'Market',
          headerRight: () => (
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              onClear={clearSearch}
            />
          ),
        }}
      />
      <Tab.Screen name="QR" component={QRScreen} options={{ title: 'QR' }} />
      <Tab.Screen name="Exchange" component={ExchangeScreen} options={{ title: 'Exchange' }} />
      <Tab.Screen name="Wallets" component={WalletListScreen} options={{ title: 'Wallets' }} />
    </Tab.Navigator>
  );
}


export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <RootStack.Screen name="Auth" component={LoginScreen} />
      ) : (
        <>
          <RootStack.Screen name="Main" component={MainTabs} />
          <RootStack.Screen
            name="WalletDetail"
            component={WalletDetailScreen}
            options={{
              headerShown: true,
              title: 'Resumen de Wallet',
              headerStyle: { backgroundColor: '#0E0F13' },
              headerTintColor: '#fff',
            }}
          />
        </>
      )}
    </RootStack.Navigator>
  );
}