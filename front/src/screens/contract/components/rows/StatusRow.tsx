import React from 'react';
import { View, Text } from 'react-native';
import { s } from '../../styles';

interface Props {
  label?: string;
  value?: string | string[] | null;
}

export const StatusRow = ({ label, value }: Props) => {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>

      {values.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            gap: 6,
            maxWidth: '50%',
          }}
        >
          {values.map(v => (
            <View key={v} style={s.tagSingle}>
              <Text style={s.tagText}>{v}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
