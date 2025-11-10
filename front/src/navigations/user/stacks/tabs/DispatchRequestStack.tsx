import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DispatchRequestsScreen from '../../../../screens/user/tab/DispatchRequestsScreen';

const Stack = createNativeStackNavigator();

export default function DispatchRequestStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DispatchRequestMain"
        component={DispatchRequestsScreen}
      />
    </Stack.Navigator>
  );
}
