import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../../states/useAuthStore';
import AdminDrawer, { AdminDrawerParamList } from '../admin/AdminDrawer';
import UserDrawer from '../user/UserDrawer';
import AuthStack from '../auth/AuthStack';
import ContractIntegratedScreen from '../../screens/contract/ContractIntegratedScreen';
import { NavigatorScreenParams } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Auth: undefined;
  AdminRoot: NavigatorScreenParams<AdminDrawerParamList>;
  UserRoot: undefined;
  ContractIntegrated: { contractId: number };
};

export default function RootNavigator() {
  const { user } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : user.role === 'ADMIN' ? (
        <Stack.Screen name="AdminRoot" component={AdminDrawer} />
      ) : (
        <Stack.Screen name="UserRoot" component={UserDrawer} />
      )}

      <Stack.Screen
        name="ContractIntegrated"
        component={ContractIntegratedScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
