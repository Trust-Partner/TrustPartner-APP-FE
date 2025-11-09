import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContractListScreen from '../../../../screens/admin/sidebar/ContractListScreen';

const Stack = createNativeStackNavigator();

export default function ContractsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ContractsMain" component={ContractListScreen} />
    </Stack.Navigator>
  );
}
