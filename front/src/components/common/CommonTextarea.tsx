import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  Dimensions,
} from 'react-native';
import { colors } from '../../constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props extends TextInputProps {
  heightScale?: number; // optional 비율 제어
}

export default function ContractTextarea({
  style,
  heightScale = 0.12,
  ...rest
}: Props) {
  const dynamicHeight = SCREEN_HEIGHT * heightScale;

  return (
    <View style={[s.wrapper, { height: dynamicHeight }]}>
      <TextInput
        {...rest}
        style={[s.input, style]}
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.GRAY_40}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    backgroundColor: colors.GRAY_05,
    padding: 8,
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 11,
    color: colors.GRAY_90,
    includeFontPadding: false,
    paddingVertical: 0,
    lineHeight: 15.4,
  },
});
