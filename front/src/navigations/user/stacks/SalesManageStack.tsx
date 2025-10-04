import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackHeaderOptions } from '../../common/headers';
import SalesManageScreen from '../../../screens/user/sidebar/SalesManageScreen';

const Stack = createNativeStackNavigator();

export default function SalesManageStack() {
  return (
    <Stack.Navigator screenOptions={stackHeaderOptions}>
      <Stack.Screen name="SalesManageMain" component={SalesManageScreen} />
    </Stack.Navigator>
  );
}
