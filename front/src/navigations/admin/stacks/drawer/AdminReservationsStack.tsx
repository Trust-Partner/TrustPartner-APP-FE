import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReservationScreen from '../../../../screens/admin/sidebar/ReservationScreen';

const Stack = createNativeStackNavigator();

export default function AdminReservationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReservationsMain" component={ReservationScreen} />
    </Stack.Navigator>
  );
}
