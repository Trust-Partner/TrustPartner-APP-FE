import React from 'react';
import { View, Text } from 'react-native';
import { s } from '../../styles';

export const StatusRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={s.infoRow}>
    <Text style={s.infoLabel}>{label}</Text>
    <View style={s.tagSingle}>
      <Text style={s.tagText}>{value}</Text>
    </View>
  </View>
);
