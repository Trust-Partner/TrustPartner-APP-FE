import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { LogBox, Platform, StatusBar, UIManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigations/root/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import './src/config/localeConfig';
import { useAuthStore } from './src/states/useAuthStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

const queryClient = new QueryClient();

export default function App() {
  const restore = useAuthStore(s => s.restore);
  const initialized = useAuthStore(s => s.initialized);

  useEffect(() => {
    restore();
  }, []);

  if (!initialized) return null;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <StatusBar
              translucent={true}
              backgroundColor="transparent"
              barStyle="dark-content"
            />
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
      <Toast />
    </>
  );
}
