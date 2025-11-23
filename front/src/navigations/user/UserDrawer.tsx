import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'react-native';
import UserDrawerContent from './UserDrawerContent';
import UserBottomTabs, { UserTabParamList } from './stacks/tabs/UserBottomTabs';
import { NavigatorScreenParams } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

export type UserDrawerParamList = {
  DrawerHome: NavigatorScreenParams<UserTabParamList>;
};

export default function UserDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: { width: 240 },
        swipeEdgeWidth: 80,
      }}
      drawerContent={props => (
        <>
          <StatusBar backgroundColor="transparent" barStyle="dark-content" />
          <UserDrawerContent {...props} />
        </>
      )}
    >
      <Drawer.Screen name="DrawerHome" component={UserBottomTabs} />
    </Drawer.Navigator>
  );
}
