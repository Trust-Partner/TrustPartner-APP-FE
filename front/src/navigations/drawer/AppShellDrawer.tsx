import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from '../tab/BottomTabNavigator';
import CustomDrawerContent from './CustomDrawerContent';
import { colors } from '../../constants/colors';
import { StatusBar } from 'react-native';

const Drawer = createDrawerNavigator();

export default function AppShellDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: 240,
        },
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
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ drawerLabel: '홈' }}
      />
    </Drawer.Navigator>
  );
}
