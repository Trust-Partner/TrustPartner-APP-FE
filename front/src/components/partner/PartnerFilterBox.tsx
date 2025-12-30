import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface Props {
  companies: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export default function PartnerFilterBox({
  companies,
  selected,
  onChange,
}: Props) {
  const rows = Array.from({ length: Math.ceil(companies.length / 4) }, (_, i) =>
    companies.slice(i * 4, i * 4 + 4),
  );

  const isAllSelected =
    selected.length === companies.length && companies.length > 0;

  const isNoneSelected = selected.length === 0;

  const toggleCompany = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter(v => v !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  return (
    <View style={s.container}>
      <View style={s.topRow}>
        <Pressable
          onPress={() => onChange(companies)}
          style={[s.topAction, isAllSelected && s.topActionActive]}
        >
          <Text style={s.topBtn}>전체 선택</Text>
        </Pressable>

        <Pressable
          onPress={() => onChange([])}
          style={[s.topAction, isNoneSelected && s.topActionActive]}
        >
          <Text style={s.topBtn}>전체 해제</Text>
        </Pressable>
      </View>

      <View style={s.divider} />

      <View style={s.rowsWrap}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={s.row}>
            {row.map(name => {
              const isActive = selected.includes(name);
              return (
                <Pressable
                  key={name}
                  style={[s.chip, isActive && s.chipActive]}
                  onPress={() => toggleCompany(name)}
                >
                  <Text style={s.chipText} numberOfLines={1}>
                    {name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topAction: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  topActionActive: {
    backgroundColor: colors.GRAY_10,
  },
  topBtn: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_60,
    lineHeight: 15.4,
  },
  divider: {
    borderWidth: 0.5,
    borderColor: colors.GRAY_10,
    marginVertical: 6,
  },
  rowsWrap: {
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  chipActive: {
    backgroundColor: colors.PRIMARY_10,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    lineHeight: 15.4,
  },
});
