import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VehicleStatusScreen from '../../../../screens/admin/tab/VehicleStatus/VehicleStatusScreen';
import DispatchGroupDetailScreen from '../../../../screens/admin/tab/VehicleStatus/DispatchGroupDetailScreen';
import VehicleCompanyDetailScreen from '../../../../screens/admin/tab/VehicleStatus/VehicleCompanyDetailScreen';

export type AdminVehicleStatusStackParamList = {
  VehicleStatusMain: undefined;
  DispatchGroupDetail: {
    type: 'sedan' | 'suv' | 'import';
    groupId: number;
    groupName: string;
    totalCount: number;
  };
  VehicleCompanyDetail: {
    companyId: number;
    companyName: string;
  };
};

const Stack = createNativeStackNavigator<AdminVehicleStatusStackParamList>();

export default function AdminVehicleStatusStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VehicleStatusMain" component={VehicleStatusScreen} />
      <Stack.Screen
        name="DispatchGroupDetail"
        component={DispatchGroupDetailScreen}
      />
      <Stack.Screen
        name="VehicleCompanyDetail"
        component={VehicleCompanyDetailScreen}
        options={{ title: '차량현황 상세' }}
      />
    </Stack.Navigator>
  );
}
