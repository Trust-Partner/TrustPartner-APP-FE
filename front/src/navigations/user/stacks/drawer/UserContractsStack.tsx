import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContractsScreen from '../../../../screens/user/sidebar/ContractListScreen';

const Stack = createNativeStackNavigator();

export default function UserContractsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ContractsMain" component={ContractsScreen} />
    </Stack.Navigator>
  );
}
