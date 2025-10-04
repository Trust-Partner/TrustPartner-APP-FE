import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackHeaderOptions } from '../../common/headers';
import ReservationScreen from '../../../screens/admin/sidebar/ReservationScreen';

const Stack = createNativeStackNavigator();

export default function ReservationsStack() {
  return (
    <Stack.Navigator screenOptions={stackHeaderOptions}>
      <Stack.Screen name="ReservationsMain" component={ReservationScreen} />
    </Stack.Navigator>
  );
}
