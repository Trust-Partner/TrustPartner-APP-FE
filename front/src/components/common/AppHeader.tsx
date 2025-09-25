import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { HeaderBackButton } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GreetingPill from '../header/GreetingPill';
import { colors } from '../../constants/colors';

export default function AppHeader({
  canGoBack = false,
}: {
  canGoBack?: boolean;
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        s.container,
        {
          paddingTop: insets.top,
          height: 56 + insets.top,
        },
      ]}
    >
      <View style={s.left}>
        {canGoBack ? (
          <HeaderBackButton onPress={() => navigation.goBack()} />
        ) : (
          <DrawerToggleButton />
        )}
      </View>
      <View style={s.center}>
        <GreetingPill text="서승동님 오늘도 화이팅하세요" />
      </View>
      <View style={s.right} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.GRAY_00,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_10,
  },
  left: {
    width: 40,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 40,
  },
});
