import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackHeaderOptions } from '../../common/headers';
import InquiryScreen from '../../../screens/user/sidebar/InquiryScreen';

const Stack = createNativeStackNavigator();

export default function InquiryStack() {
  return (
    <Stack.Navigator screenOptions={stackHeaderOptions}>
      <Stack.Screen name="InquiryMain" component={InquiryScreen} />
    </Stack.Navigator>
  );
}
