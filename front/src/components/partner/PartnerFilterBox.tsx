import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface PartnerItem {
  partnerId: string;
  partnerName: string;
}

interface Props {
  partners: PartnerItem[];
  initialSelectedIds: string[] | null; // null = 전체
  onApply: (next: string[] | null) => void;
}

export default function PartnerFilterBox({
  partners,
  initialSelectedIds,
  onApply,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[] | null>(
    initialSelectedIds,
  );

  const rows = Array.from({ length: Math.ceil(partners.length / 4) }, (_, i) =>
    partners.slice(i * 4, i * 4 + 4),
  );

  const isAllSelected = selectedIds === null;
  const isNoneSelected = Array.isArray(selectedIds) && selectedIds.length === 0;

  const togglePartner = (partnerId: string) => {
    if (selectedIds === null) {
      // 전체 → 하나 해제
      setSelectedIds(
        partners.map(p => p.partnerId).filter(id => id !== partnerId),
      );
      return;
    }

    if (selectedIds.includes(partnerId)) {
      setSelectedIds(selectedIds.filter(id => id !== partnerId));
    } else {
      setSelectedIds([...selectedIds, partnerId]);
    }
  };

  useEffect(() => {
    setSelectedIds(initialSelectedIds);
  }, [initialSelectedIds]);

  return (
    <View style={s.container}>
      {/* 상단 전체/해제 */}
      <View style={s.topRow}>
        <Pressable
          onPress={() => setSelectedIds(null)}
          style={[s.topAction, isAllSelected && s.topActionActive]}
        >
          <Text style={s.topBtn}>전체 선택</Text>
        </Pressable>

        <Pressable
          onPress={() => setSelectedIds([])}
          style={[s.topAction, isNoneSelected && s.topActionActive]}
        >
          <Text style={s.topBtn}>전체 해제</Text>
        </Pressable>
      </View>

      <View style={s.divider} />

      {/* 파트너 선택 */}
      <View style={s.rowsWrap}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={s.row}>
            {row.map(partner => {
              const isActive =
                selectedIds === null || selectedIds.includes(partner.partnerId);

              return (
                <Pressable
                  key={partner.partnerId}
                  style={[s.chip, isActive && s.chipActive]}
                  onPress={() => togglePartner(partner.partnerId)}
                >
                  <Text style={s.chipText} numberOfLines={1}>
                    {partner.partnerName}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* 조회 버튼 */}
      <Pressable style={s.applyButton} onPress={() => onApply(selectedIds)}>
        <Text style={s.applyButtonText}>조회</Text>
      </Pressable>
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
    fontSize: 17,
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
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_50,
    lineHeight: 15.4,
  },
  applyButton: {
    marginTop: 8,
    backgroundColor: colors.PRIMARY_50,
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.WHITE,
  },
});
