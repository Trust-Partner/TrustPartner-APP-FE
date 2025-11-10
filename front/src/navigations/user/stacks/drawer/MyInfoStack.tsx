import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackHeaderOptions } from '../../../common/headers';
import MyInfoScreen from '../../../../screens/user/sidebar/MyInfoScreen';

const Stack = createNativeStackNavigator();

export default function MyInfoStack() {
  return (
    <Stack.Navigator screenOptions={stackHeaderOptions}>
      <Stack.Screen name="MyInfoMain" component={MyInfoScreen} />
    </Stack.Navigator>
  );
}
