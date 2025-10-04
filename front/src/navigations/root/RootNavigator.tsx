// src/navigations/root/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../../states/useAuthStore';
import AdminDrawer from '../admin/AdminDrawer';
import UserDrawer from '../user/UserDrawer';
import AuthScreen from '../../screens/common/AuthScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : user.role === 'admin' ? (
        <Stack.Screen name="AdminRoot" component={AdminDrawer} />
      ) : (
        <Stack.Screen name="UserRoot" component={UserDrawer} />
      )}
    </Stack.Navigator>
  );
}
