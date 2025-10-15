import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoScreen from '../../../../screens/admin/tab/todo/TodoScreen';
import TodoReturnDetailScreen from '../../../../screens/admin/tab/todo/TodoReturnDetailScreen';
import TodoWashFuelDetailScreen from '../../../../screens/admin/tab/todo/TodoWashFuelDetailScreen';

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
