import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackHeaderOptions } from '../../common/headers';
import ContractsScreen from '../../../screens/user/sidebar/ContractListScreen';

const Stack = createNativeStackNavigator();

export default function ContractsStack() {
  return (
    <Stack.Navigator screenOptions={stackHeaderOptions}>
      <Stack.Screen name="ContractsMain" component={ContractsScreen} />
    </Stack.Navigator>
  );
}
