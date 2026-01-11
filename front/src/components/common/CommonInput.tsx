import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  Platform,
} from 'react-native';
import { colors } from '../../constants/colors';

interface Props extends TextInputProps {}

export default function CommonInput({ style, ...rest }: Props) {
  return (
    <View style={s.wrapper}>
      <TextInput
        {...rest}
        style={[s.input, style]}
        placeholderTextColor={colors.GRAY_50}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    backgroundColor: colors.GRAY_05,
    borderRadius: 4,
    marginBottom: 8,
    justifyContent: 'center',
  },
  input: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_50,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'android' ? 2 : 8,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
