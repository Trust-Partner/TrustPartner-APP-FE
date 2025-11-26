import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SalesManageScreen from '../../../../screens/user/tab/SalesManageScreen';

const Stack = createNativeStackNavigator();

export default function UserSalesManageStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SalesManageMain" component={SalesManageScreen} />
    </Stack.Navigator>
  );
}
