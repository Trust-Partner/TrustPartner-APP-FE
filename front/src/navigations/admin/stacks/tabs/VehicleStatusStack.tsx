import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VehicleStatusScreen from '../../../../screens/admin/tab/VehicleStatusScreen';
import DispatchGroupDetailScreen from '../../../../screens/admin/tab/DispatchGroupDetailScreen';

export type VehicleStatusStackParamList = {
  VehicleStatusMain: undefined;
  DispatchGroupDetail: {
    type: 'sedan' | 'suv' | 'import';
    groupId: number;
    groupName: string;
    totalCount: number;
  };
};

const Stack = createNativeStackNavigator<VehicleStatusStackParamList>();

export default function VehicleStatusStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VehicleStatusMain" component={VehicleStatusScreen} />
      <Stack.Screen
        name="DispatchGroupDetail"
        component={DispatchGroupDetailScreen}
      />
    </Stack.Navigator>
  );
}
