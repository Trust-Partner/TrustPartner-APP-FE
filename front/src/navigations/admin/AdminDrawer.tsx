import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'react-native';
import { colors } from '../../constants/colors';

import BottomTabNavigator from './AdminBottomTabs';
import CustomDrawerContent from './AdminDrawerContent';

import MyInfoStack from './stacks/MyInfoStack';
import PartnersStack from './stacks/PartnersStack';
import ContractsStack from './stacks/ContractsStack';
import PrepayStack from './stacks/PrepayStack';
import ReservationsStack from './stacks/ReservationsStack';

const Drawer = createDrawerNavigator();

export default function AdminDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="AdminTabs"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: { width: 240 },
        overlayColor: colors.TRANSLUCENT,
        swipeEdgeWidth: 40,
      }}
      drawerContent={props => (
        <>
          <StatusBar backgroundColor="transparent" barStyle="dark-content" />
          <CustomDrawerContent {...props} />
        </>
      )}
    >
      <Drawer.Screen
        name="AdminTabs"
        component={BottomTabNavigator}
        options={{ drawerLabel: () => null, title: undefined }}
      />
      <Drawer.Screen name="MyInfo" component={MyInfoStack} />
      <Drawer.Screen name="Partners" component={PartnersStack} />
      <Drawer.Screen name="Contracts" component={ContractsStack} />
      <Drawer.Screen name="Prepay" component={PrepayStack} />
      <Drawer.Screen name="Reservations" component={ReservationsStack} />
    </Drawer.Navigator>
  );
}
