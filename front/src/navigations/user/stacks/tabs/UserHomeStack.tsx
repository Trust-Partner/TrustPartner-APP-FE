import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../../../screens/user/tab/HomeScreen';

const Stack = createNativeStackNavigator();

export default function UserHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  );
}
