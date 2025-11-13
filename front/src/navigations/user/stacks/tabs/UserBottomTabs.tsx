import React, { useMemo } from 'react';
import { Image, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../../constants/colors';
import { drawerHeaderOptions } from '../../../common/headers';
import HomeStack from './HomeStack';
import NotificationsStack from './NotificationsStack';
import SalesManageStack from './SalesManageStack';
import VehicleStatusStack from './VehicleStatusStack';
import DispatchRequestStack from './DispatchRequestStack';

export type UserTabParamList = {
  Home: undefined;
  VehicleStatus: undefined;
  DispatchRequests: undefined;
  Sales: undefined;
  Notifications: undefined;
};

const Tab = createBottomTabNavigator<UserTabParamList>();

export default function UserBottomTabs() {
  const insets = useSafeAreaInsets();
  const ACTIVE = colors.PRIMARY_50;
  const INACTIVE = '#9CA3AF';
  const tabBarHeight = Platform.select({ ios: 64, android: 60 }) ?? 60;

  const iconMap = useMemo(
    () => ({
      Home: require('../../../../assets/bottom-tabs/Home.png'),
      VehicleStatus: require('../../../../assets/bottom-tabs/VehicleStatus.png'),
      DispatchRequests: require('../../../../assets/bottom-tabs/DispatchRequests.png'),
      Sales: require('../../../../assets/bottom-tabs/Sales.png'),
      Notifications: require('../../../../assets/bottom-tabs/Notifications.png'),
    }),
    [],
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...drawerHeaderOptions,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          height: tabBarHeight + 20,
          paddingTop: 6,
          paddingBottom: insets.bottom,
          backgroundColor: '#fff',
          borderTopColor: colors.GRAY_10,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 2 },
        tabBarIcon: ({ focused }) => (
          <Image
            source={iconMap[route.name as keyof typeof iconMap]}
            style={{
              width: 24,
              height: 24,
              tintColor: focused ? ACTIVE : INACTIVE,
            }}
            resizeMode="contain"
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: '홈' }} />
      <Tab.Screen
        name="VehicleStatus"
        component={VehicleStatusStack}
        options={{ title: '차량현황' }}
      />
      <Tab.Screen
        name="DispatchRequests"
        component={DispatchRequestStack}
        options={{ title: '배차요청' }}
      />
      <Tab.Screen
        name="Sales"
        component={SalesManageStack}
        options={{ title: '매출관리' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsStack}
        options={{ title: '알림' }}
      />
    </Tab.Navigator>
  );
}
