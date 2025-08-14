import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import MarketsScreen from '../screens/MarketsScreen';
import ScannerScreen from '../screens/ScannerScreen';
import AdressFavoriteList from '../screens/AddressFavoriteList';
import SearchBar from '../components/SearchBar';
import { useMarketStore } from '../store/MarketStore';
import ExchangeScreen from '../screens/ExchangeScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
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
            Markets: 'trending-up',
            Exchange: 'swap-horizontal',
            Scanner: 'qr-code',
            Wallets: 'wallet',
            Favorites: 'star',
          };
          const name = map[route.name] ?? 'ellipse';
          return <Icon name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Markets"
        component={MarketsScreen}
        options={{
          title: 'Criptos',
          headerRight: () => (
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              onClear={clearSearch}
            />
          ),
        }}
      />
      <Tab.Screen name="Scanner" component={ScannerScreen} options={{ title: 'QR' }} />
      <Tab.Screen name="Exchange" component={ExchangeScreen} options={{ title: 'Exchange' }} />
      <Tab.Screen name="Favorites" component={AdressFavoriteList} options={{ title: 'Favotiros' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user, initializing } = useAuth();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <RootStack.Screen name="Auth" component={LoginScreen} />
      ) : (
        <RootStack.Screen name="Main" component={MainTabs} />
      )}
    </RootStack.Navigator>
  );
}