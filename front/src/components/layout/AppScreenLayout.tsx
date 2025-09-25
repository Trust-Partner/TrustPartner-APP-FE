import React, { ReactNode } from 'react';
import { StyleSheet, Platform, StatusBar } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { colors } from '../../constants/colors';

type Props = {
  children: ReactNode;
  disableTopInset?: boolean;
  disableBottomInset?: boolean;
  withTabBar?: boolean;
  backgroundColor?: string;
};

export default function AppScreenLayout({
  children,
  disableTopInset = false,
  disableBottomInset = false,
  withTabBar = false,
  backgroundColor = colors.GRAY_00,
}: Props) {
  const insets = useSafeAreaInsets();
  let tabBarHeightSafe = 0;
  try {
    tabBarHeightSafe = useBottomTabBarHeight();
  } catch {
    tabBarHeightSafe = 0;
  }

  const topInset =
    Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : insets.top;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor },
        !disableTopInset && { paddingTop: topInset },
        !disableBottomInset && {
          paddingBottom: withTabBar ? tabBarHeightSafe : insets.bottom,
        },
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
