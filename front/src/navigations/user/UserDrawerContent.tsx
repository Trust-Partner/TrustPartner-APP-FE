import React from 'react';
import {
  DrawerContentComponentProps,
  DrawerItem,
} from '@react-navigation/drawer';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../states/useAuthStore';

export default function UserDrawerContent(props: DrawerContentComponentProps) {
  const logout = useAuthStore(s => s.logout);
  const go = (
    name: 'UserMyInfo' | 'UserProfitAnalysis' | 'UserContracts' | 'UserInquiry',
  ) => {
    props.navigation.closeDrawer();
    props.navigation.navigate(name);
  };

  const handleLogout = () => {
    logout();
    props.navigation.closeDrawer();
  };

  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ paddingTop: insets.top + 12 }}
    >
      <Text style={s.title}>메뉴</Text>

      <DrawerItem
        label="내 정보"
        labelStyle={s.label}
        onPress={() => go('UserMyInfo')}
      />
      <DrawerItem
        label="수익 분석"
        labelStyle={s.label}
        onPress={() => go('UserProfitAnalysis')}
      />
      <DrawerItem
        label="계약서 목록"
        labelStyle={s.label}
        onPress={() => go('UserContracts')}
      />
      <DrawerItem
        label="문의하기"
        labelStyle={s.label}
        onPress={() => go('UserInquiry')}
      />

      <View style={s.divider} />

      <DrawerItem
        label="로그아웃"
        labelStyle={s.logout}
        onPress={handleLogout}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.GRAY_90,
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.GRAY_90,
  },
  divider: {
    height: 1,
    backgroundColor: colors.GRAY_15,
    marginVertical: 12,
  },
  logout: {
    color: colors.RED_50,
    fontWeight: '500',
    fontSize: 14,
  },
});
