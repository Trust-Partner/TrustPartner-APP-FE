import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppShellDrawer from '../drawer/AppShellDrawer';
import { stackHeaderOptions } from '../common/headers';
import GreetingPill from '../../components/header/GreetingPill';

// ▸ 드로어 항목으로 여는 스택 화면들
import MyInfoScreen from '../../screens/sidebar/MyInfoScreen';
import PartnersScreen from '../../screens/sidebar/PartnersScreen';
import ContractsScreen from '../../screens/sidebar/ContractListScreen';
import PrepayScreen from '../../screens/sidebar/PrepayScreen';
import ReservationScreen from '../../screens/sidebar/ReservationScreen';

export type RootStackParamList = {
  AppShell: undefined; // 드로어 + 탭
  MyInfo: undefined;
  Partners: undefined;
  Contracts: undefined;
  Prepay: undefined;
  Reservations: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="AppShell">
      <Stack.Screen
        name="AppShell"
        component={AppShellDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyInfo"
        component={MyInfoScreen}
        options={stackHeaderOptions}
      />
      <Stack.Screen
        name="Partners"
        component={PartnersScreen}
        options={stackHeaderOptions}
      />
      <Stack.Screen
        name="Contracts"
        component={ContractsScreen}
        options={stackHeaderOptions}
      />
      <Stack.Screen
        name="Prepay"
        component={PrepayScreen}
        options={stackHeaderOptions}
      />
      <Stack.Screen
        name="Reservations"
        component={ReservationScreen}
        options={stackHeaderOptions}
      />
    </Stack.Navigator>
  );
}
