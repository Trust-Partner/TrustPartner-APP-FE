import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export default function GreetingPill({ text }: { text: string }) {
  return (
    <View style={s.pill}>
      <Text numberOfLines={1} style={s.pillText}>
        {text}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  pill: {
    minHeight: 36,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.PRIMARY_10,
    backgroundColor: colors.GRAY_00,
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.GRAY_90,
  },
});
