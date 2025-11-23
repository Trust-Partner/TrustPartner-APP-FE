import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyInfoScreen from '../../../../screens/admin/sidebar/MyInfoScreen';

const Stack = createNativeStackNavigator();

export default function AdminMyInfoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyInfoMain" component={MyInfoScreen} />
    </Stack.Navigator>
  );
}
