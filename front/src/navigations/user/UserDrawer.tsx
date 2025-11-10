import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'react-native';
import { colors } from '../../constants/colors';

import CustomDrawerContent from './UserDrawerContent';

import MyInfoStack from './stacks/drawer/MyInfoStack';
import ContractsStack from './stacks/drawer/ContractsStack';
import ProfitAnalysisStack from './stacks/drawer/ProfitAnalysisStack';
import InquiryStack from './stacks/drawer/InquiryStack';
import UserBottomTabs from './stacks/tabs/UserBottomTabs';

const Drawer = createDrawerNavigator();

export default function UserDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="UserTabs"
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
        name="UserTabs"
        component={UserBottomTabs}
        options={{ drawerLabel: () => null, title: undefined }}
      />
      <Drawer.Screen name="MyInfo" component={MyInfoStack} />
      <Drawer.Screen name="ProfitAnalysis" component={ProfitAnalysisStack} />
      <Drawer.Screen name="Contracts" component={ContractsStack} />
      <Drawer.Screen name="Inquiry" component={InquiryStack} />
    </Drawer.Navigator>
  );
}
