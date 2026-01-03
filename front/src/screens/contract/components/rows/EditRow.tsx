import React from 'react';
import { View, Text, TextInput, Platform } from 'react-native';
import { colors } from '../../../../constants/colors';
import { s } from '../../styles';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const EditRow = ({ label, value, onChangeText }: Props) => (
  <View style={s.infoRow}>
    <Text style={[s.infoLabel, { flex: 0.4, minWidth: 80 }]} numberOfLines={1}>
      {label}
    </Text>
    <TextInput
      style={{
        flex: 0.6,
        minWidth: 140,
        backgroundColor: colors.GRAY_05,
        borderWidth: 1,
        borderColor: colors.GRAY_10,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: Platform.OS === 'android' ? 0 : 8,
        fontSize: 11,
        color: colors.GRAY_90,
      }}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);
