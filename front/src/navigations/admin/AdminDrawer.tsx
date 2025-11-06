import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'react-native';
import { colors } from '../../constants/colors';

import CustomDrawerContent from './AdminDrawerContent';
import PartnerManageStack from './stacks/drawer/PartnerManageStack';
import PrepayStack from './stacks/drawer/PrepayStack';
import ReservationsStack from './stacks/drawer/ReservationsStack';
import AdminBottomTabs, {
  AdminTabParamList,
} from './stacks/tabs/AdminBottomTabs';
import MyInfoStack from './stacks/drawer/MyInfoStack';
import ContractsStack from './stacks/drawer/ContractsStack';
import { NavigatorScreenParams } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

export type AdminDrawerParamList = {
  AdminTabsStack: NavigatorScreenParams<AdminTabParamList>;
  MyInfo: undefined;
  PartnerManage: undefined;
  Contracts: undefined;
  Prepay: undefined;
  Reservations: undefined;
};

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
