import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackHeaderOptions } from '../../common/headers';
import PartnersScreen from '../../../screens/admin/sidebar/PartnersScreen';

const Stack = createNativeStackNavigator();

export default function PartnersStack() {
  return (
    <Stack.Navigator screenOptions={stackHeaderOptions}>
      <Stack.Screen name="PartnersMain" component={PartnersScreen} />
    </Stack.Navigator>
  );
}
