import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        !disableTopInset && { paddingTop: insets.top },
        !disableBottomInset && {
          paddingBottom: withTabBar ? tabBarHeight : insets.bottom,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
