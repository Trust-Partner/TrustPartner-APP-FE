import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { s } from '../../styles';
import { colors } from '../../../../constants/colors';
import { HIT_SLOP } from '../../../../constants/touch';

interface Props {
  label: string;
  value: string;
  suffix?: React.ReactNode;
  copyable?: boolean;
  onCopy?: (value: string, label: string) => void;
}

export const InfoRow = ({ label, value, suffix, copyable, onCopy }: Props) => {
  const hasValue = value != null && value !== '';

  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={s.infoValue}>{value ?? ''}</Text>

        {suffix && hasValue && <Text style={s.infoValue}>{suffix}</Text>}

        {copyable && hasValue && (
          <View style={{ marginLeft: 4 }}>
            <Pressable
              hitSlop={HIT_SLOP.SAFE_VERTICAL}
              onPress={() => onCopy?.(value, label)}
            >
              <Image
                source={require('../../../../assets/common/copy.png')}
                style={{ width: 14, height: 14, tintColor: colors.GRAY_80 }}
              />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};
