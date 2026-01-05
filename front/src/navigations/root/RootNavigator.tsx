import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../../states/useAuthStore';
import AdminDrawer, { AdminDrawerParamList } from '../admin/AdminDrawer';
import UserDrawer, { UserDrawerParamList } from '../user/UserDrawer';
import AuthStack from '../auth/AuthStack';
import ContractIntegratedScreen from '../../screens/contract/ContractIntegratedScreen';
import { NavigatorScreenParams } from '@react-navigation/native';

import AdminContractsStack from '../admin/stacks/drawer/AdminContractsStack';
import AdminMyInfoStack from '../admin/stacks/drawer/AdminMyInfoStack';
import AdminPartnerManageStack from '../admin/stacks/drawer/AdminPartnerManageStack';
import AdminPrepayStack from '../admin/stacks/drawer/AdminPrepayStack';
import AdminReservationsStack from '../admin/stacks/drawer/AdminReservationsStack';
import UserContractsStack from '../user/stacks/drawer/UserContractsStack';
import UserInquiryStack from '../user/stacks/drawer/UserInquiryStack';
import UserMyInfoStack from '../user/stacks/drawer/UserMyInfoStack';
import UserProfitAnalysisStack from '../user/stacks/drawer/UserProfitAnalysisStack';
import { ContractType } from '../../screens/contract/types';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Auth: undefined;
  AdminRoot: NavigatorScreenParams<AdminDrawerParamList>;
  UserRoot: NavigatorScreenParams<UserDrawerParamList>;
  ContractIntegrated: {
    contractId: number;
    contractType: ContractType;
  };
};

export default function RootNavigator() {
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : user.kind === 'ADMIN' ? (
        <>
          <Stack.Screen name="AdminRoot" component={AdminDrawer} />

          <Stack.Screen name="AdminMyInfo" component={AdminMyInfoStack} />
          <Stack.Screen
            name="AdminPartnerManage"
            component={AdminPartnerManageStack}
          />
          <Stack.Screen name="AdminContracts" component={AdminContractsStack} />
          <Stack.Screen name="AdminPrepay" component={AdminPrepayStack} />
          <Stack.Screen
            name="AdminReservations"
            component={AdminReservationsStack}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="UserRoot" component={UserDrawer} />

          <Stack.Screen name="UserMyInfo" component={UserMyInfoStack} />
          <Stack.Screen name="UserContracts" component={UserContractsStack} />
          <Stack.Screen
            name="UserProfitAnalysis"
            component={UserProfitAnalysisStack}
          />
          <Stack.Screen name="UserInquiry" component={UserInquiryStack} />
        </>
      )}

      <Stack.Screen
        name="ContractIntegrated"
        component={ContractIntegratedScreen}
      />
    </Stack.Navigator>
  );
}
