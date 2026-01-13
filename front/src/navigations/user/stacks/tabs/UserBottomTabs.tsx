import React, { useMemo } from 'react';
import { Image, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../../constants/colors';
import { drawerHeaderOptions } from '../../../common/headers';
import UserDispatchRequestStack from './UserDispatchRequestStack';
import UserHomeStack from './UserHomeStack';
import UserNotificationsStack from './UserNotificationsStack';
import UserSalesManageStack from './UserSalesManageStack';
import UserVehicleStatusStack from './UserVehicleStatusStack';

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
  const TAB_BAR_BASE_HEIGHT =
    Platform.select({
      ios: 64,
      android: 56,
    }) ?? 56;

  const MIN_BOTTOM_PADDING = Platform.OS === 'android' ? 8 : 0;
  const bottomInset = Math.max(insets.bottom, MIN_BOTTOM_PADDING);

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
          height: TAB_BAR_BASE_HEIGHT + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
          backgroundColor: '#fff',
          borderTopColor: colors.GRAY_10,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 14, marginBottom: 2 },
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
      <Tab.Screen
        name="Home"
        component={UserHomeStack}
        options={{ title: '홈' }}
      />
      <Tab.Screen
        name="VehicleStatus"
        component={UserVehicleStatusStack}
        options={{ title: '차량현황' }}
      />
      <Tab.Screen
        name="DispatchRequests"
        component={UserDispatchRequestStack}
        options={{ title: '배차요청' }}
      />
      <Tab.Screen
        name="Sales"
        component={UserSalesManageStack}
        options={{ title: '매출관리' }}
      />
      <Tab.Screen
        name="Notifications"
        component={UserNotificationsStack}
        options={{ title: '알림' }}
      />
    </Tab.Navigator>
  );
}
