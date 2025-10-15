import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoScreen from '../../../../screens/admin/tab/TodoScreen';
import TodoReturnDetailScreen from '../../../../screens/admin/tab/TodoReturnDetailScreen';
import TodoWashFuelDetailScreen from '../../../../screens/admin/tab/TodoWashFuelDetailScreen';

export type TodoStackParamList = {
  TodoMain: undefined;
  TodoReturnDetail: {
    companyId: number;
    companyName: string;
  };
  TodoWashFuelDetail: {
    companyId: number;
    companyName: string;
  };
};

const Stack = createNativeStackNavigator<TodoStackParamList>();

export default function TodoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TodoMain" component={TodoScreen} />
      <Stack.Screen
        name="TodoReturnDetail"
        component={TodoReturnDetailScreen}
      />
      <Stack.Screen
        name="TodoWashFuelDetail"
        component={TodoWashFuelDetailScreen}
      />
    </Stack.Navigator>
  );
}
