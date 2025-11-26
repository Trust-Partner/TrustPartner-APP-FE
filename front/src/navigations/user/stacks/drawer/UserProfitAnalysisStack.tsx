import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfitAnalysisScreen from '../../../../screens/user/sidebar/ProfitAnalysisScreen';

const Stack = createNativeStackNavigator();

export default function UserProfitAnalysisStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ProfitAnalysisMain"
        component={ProfitAnalysisScreen}
      />
    </Stack.Navigator>
  );
}
