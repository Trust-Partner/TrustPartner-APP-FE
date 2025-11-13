import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VehicleStatusScreen from '../../../../screens/user/tab/VehicleStatusScreen';

const Stack = createNativeStackNavigator();

export default function VehicleStatusStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VehicleStatusMain" component={VehicleStatusScreen} />
    </Stack.Navigator>
  );
}
