import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrepayScreen from '../../../../screens/admin/sidebar/PrepayScreen';

const Stack = createNativeStackNavigator();

export default function PrepayStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PrepayMain" component={PrepayScreen} />
    </Stack.Navigator>
  );
}
