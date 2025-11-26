import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'react-native';
import AdminDrawerContent from './AdminDrawerContent';
import AdminBottomTabs, {
  AdminTabParamList,
} from './stacks/tabs/AdminBottomTabs';
import { NavigatorScreenParams } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

export type AdminDrawerParamList = {
  DrawerHome: NavigatorScreenParams<AdminTabParamList>;
};

export default function AdminDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="DrawerHome"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: { width: 240 },
        swipeEdgeWidth: 80,
      }}
      drawerContent={props => (
        <>
          <StatusBar backgroundColor="transparent" barStyle="dark-content" />
          <AdminDrawerContent {...props} />
        </>
      )}
    >
      <Drawer.Screen name="DrawerHome" component={AdminBottomTabs} />
    </Drawer.Navigator>
  );
}
