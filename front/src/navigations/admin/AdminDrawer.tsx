import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'react-native';
import { colors } from '../../constants/colors';

import CustomDrawerContent from './AdminDrawerContent';
import PartnerManageStack from './stacks/drawer/PartnerManageStack';
import PrepayStack from './stacks/drawer/PrepayStack';
import ReservationsStack from './stacks/drawer/ReservationsStack';
import AdminBottomTabs from './stacks/tabs/AdminBottomTabs';
import MyInfoStack from './stacks/drawer/MyInfoStack';
import ContractsStack from './stacks/drawer/ContractsStack';

const Drawer = createDrawerNavigator();

export default function AdminDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="AdminTabsStack"
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
        name="AdminTabsStack"
        component={AdminBottomTabs}
        options={{ drawerLabel: () => null, title: undefined }}
      />
      <Drawer.Screen name="MyInfo" component={MyInfoStack} />
      <Drawer.Screen name="PartnerManage" component={PartnerManageStack} />
      <Drawer.Screen name="Contracts" component={ContractsStack} />
      <Drawer.Screen name="Prepay" component={PrepayStack} />
      <Drawer.Screen name="Reservations" component={ReservationsStack} />
    </Drawer.Navigator>
  );
}
