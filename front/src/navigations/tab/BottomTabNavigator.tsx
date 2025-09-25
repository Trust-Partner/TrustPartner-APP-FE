import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../../screens/HomeScreen';
import VehicleStatusScreen from '../../screens/VehicleStatusScreen';
import DispatchRequestsScreen from '../../screens/DispatchRequestsScreen';
import TasksScreen from '../../screens/TasksScreen';
import NotificationsScreen from '../../screens/NotificationsScreen';
import { colors } from '../../constants/colors';

export type BottomTabParamList = {
  Home: undefined;
  VehicleStatus: undefined;
  DispatchRequests: undefined;
  Tasks: undefined;
  Notifications: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const ACTIVE = '#3352F2';
const INACTIVE = '#7A7F8A';

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.BLUE_50,
        tabBarInactiveTintColor: colors.GRAY_50,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 80 : 65,
          paddingBottom: insets.bottom,
          paddingTop: 6,
          backgroundColor: '#fff',
          borderTopColor: colors.GRAY_10,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          lineHeight: 15.4,
        },
        tabBarIcon: ({ focused }) => {
          const icons: Record<string, any> = {
            Home: require('../../assets/bottom-tabs/Home.png'),
            VehicleStatus: require('../../assets/bottom-tabs/VehicleStatus.png'),
            DispatchRequests: require('../../assets/bottom-tabs/DispatchRequests.png'),
            Tasks: require('../../assets/bottom-tabs/Tasks.png'),
            Notifications: require('../../assets/bottom-tabs/Notifications.png'),
          };
          return (
            <Image
              source={icons[route.name]}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? ACTIVE : INACTIVE,
              }}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '홈' }}
      />
      <Tab.Screen
        name="VehicleStatus"
        component={VehicleStatusScreen}
        options={{ title: '차량현황' }}
      />
      <Tab.Screen
        name="DispatchRequests"
        component={DispatchRequestsScreen}
        options={{ title: '배차요청건' }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ title: '할일' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: '알림' }}
      />
    </Tab.Navigator>
  );
}
