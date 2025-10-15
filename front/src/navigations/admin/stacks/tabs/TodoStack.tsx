import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoScreen from '../../../../screens/admin/tab/TodoScreen';

const Stack = createNativeStackNavigator();

export default function TodoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TodoMain" component={TodoScreen} />
    </Stack.Navigator>
  );
}
