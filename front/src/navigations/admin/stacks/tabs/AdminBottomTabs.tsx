import React, { useMemo } from 'react';
import { Image, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../../constants/colors';
import { drawerHeaderOptions } from '../../../common/headers';

import AdminDispatchRequestStack from './AdminDispatchRequestStack';
import AdminHomeStack from './AdminHomeStack';
import AdminNotificationsStack from './AdminNotificationsStack';
import AdminTodoStack from './AdminTodoStack';
import AdminVehicleStatusStack from './AdminVehicleStatusStack';

export type AdminTabParamList = {
  Home: undefined;
  VehicleStatus: undefined;
  DispatchRequests: undefined;
  Todo: undefined;
  Notifications: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function AdminBottomTabs() {
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
      Todo: require('../../../../assets/bottom-tabs/Todo.png'),
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
        component={AdminHomeStack}
        options={{ title: '홈' }}
      />
      <Tab.Screen
        name="VehicleStatus"
        component={AdminVehicleStatusStack}
        options={{ title: '차량상태', headerShown: false }}
      />
      <Tab.Screen
        name="DispatchRequests"
        component={AdminDispatchRequestStack}
        options={{ title: '배차요청건' }}
      />
      <Tab.Screen
        name="Todo"
        component={AdminTodoStack}
        options={{ title: '할일' }}
      />
      <Tab.Screen
        name="Notifications"
        component={AdminNotificationsStack}
        options={{ title: '알림' }}
      />
    </Tab.Navigator>
  );
}
