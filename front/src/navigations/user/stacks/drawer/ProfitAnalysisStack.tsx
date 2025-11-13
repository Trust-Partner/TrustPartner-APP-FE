import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackHeaderOptions } from '../../../common/headers';
import ProfitAnalysisScreen from '../../../../screens/user/sidebar/ProfitAnalysisScreen';

const Stack = createNativeStackNavigator();

export default function ProfitAnalysisStack() {
  return (
    <Stack.Navigator screenOptions={stackHeaderOptions}>
      <Stack.Screen
        name="ProfitAnalysisMain"
        component={ProfitAnalysisScreen}
      />
    </Stack.Navigator>
  );
}
