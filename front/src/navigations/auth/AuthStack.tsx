import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../../screens/auth/AuthScreen';
import FindIdScreen from '../../screens/auth/FindIdScreen';
import FindPwScreen from '../../screens/auth/FindPwScreen';

export type AuthStackParamList = {
  Login: undefined;
  FindId: undefined;
  FindPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={AuthScreen} />
      <Stack.Screen name="FindId" component={FindIdScreen} />
      <Stack.Screen name="FindPassword" component={FindPwScreen} />
    </Stack.Navigator>
  );
}
