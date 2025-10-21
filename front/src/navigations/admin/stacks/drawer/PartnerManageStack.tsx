import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackHeaderOptions } from '../../../common/headers';
import PartnerManageScreen from '../../../../screens/admin/sidebar/PartnerManageScreen';

const Stack = createNativeStackNavigator();

export default function PartnerManageStack() {
  return (
    <Stack.Navigator screenOptions={stackHeaderOptions}>
      <Stack.Screen name="PartnerManageMain" component={PartnerManageScreen} />
    </Stack.Navigator>
  );
}
