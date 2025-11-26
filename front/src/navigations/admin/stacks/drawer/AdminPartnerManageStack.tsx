import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PartnerManageScreen from '../../../../screens/admin/sidebar/PartnerManageScreen';

const Stack = createNativeStackNavigator();

export default function AdminPartnerManageStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PartnerManageMain" component={PartnerManageScreen} />
    </Stack.Navigator>
  );
}
