import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../../../screens/admin/tab/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AdminHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  );
}
