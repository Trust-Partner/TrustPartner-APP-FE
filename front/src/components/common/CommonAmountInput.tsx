import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Platform,
  TextInputProps,
} from 'react-native';
import { colors } from '../../constants/colors';

interface Props extends TextInputProps {
  unit?: string; // ex) "원"
  onValueChange?: (raw: string) => void; // 콤마 없는 실제 값 전달용
}

export default function CommonAmountInput({
  style,
  unit = '원',
  value,
  onChangeText,
  onValueChange,
  placeholder = '금액 입력',
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);

  // 콤마 제거 후 포맷
  const formatNumber = (text: string) => {
    const onlyNums = text.replace(/[^0-9]/g, ''); // 숫자만 남기기
    if (!onlyNums) return '';
    return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleChange = (text: string) => {
    const formatted = formatNumber(text);
    const raw = text.replace(/[^0-9]/g, '');
    onChangeText?.(formatted);
    onValueChange?.(raw);
  };

  const showPlaceholder = !value && !focused;

  return (
    <View style={s.wrapper}>
      {/* 왼쪽 placeholder */}
      {showPlaceholder && <Text style={s.placeholder}>{placeholder}</Text>}

      {/* 입력 */}
      <TextInput
        {...rest}
        value={value}
        onChangeText={handleChange}
        style={[s.input, style]}
        placeholderTextColor="transparent"
        keyboardType="number-pad"
        textAlign="right"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {/* 단위 */}
      <View pointerEvents="none" style={s.unitBox}>
        <Text style={s.unitText}>{unit}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    backgroundColor: colors.GRAY_05,
    borderRadius: 4,
    marginBottom: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  placeholder: {
    position: 'absolute',
    paddingLeft: 8,
    color: colors.GRAY_50,
    fontSize: 17,
    fontWeight: '400',
    top: Platform.OS === 'android' ? '25%' : '27%',
  },
  input: {
    fontSize: 17,
    color: colors.GRAY_50,
    includeFontPadding: false,
    paddingVertical: Platform.OS === 'android' ? 6 : 12,
    textAlignVertical: 'center',
    paddingRight: 25,
    lineHeight: 25,
  },
  unitBox: {
    position: 'absolute',
    right: 14,
    top: Platform.OS === 'android' ? '50%' : '52%',
    transform: [{ translateY: -9 }],
  },
  unitText: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_50,
    lineHeight: 25,
  },
});
