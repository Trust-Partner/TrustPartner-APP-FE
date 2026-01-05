import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../../../constants/colors';
import { s } from '../styles';

interface Props {
  model: string;
  number: string;
  isEditMode: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ContractHeaderSection = ({
  model,
  number,
  isEditMode,
  onEdit,
  onSave,
  onCancel,
}: Props) => {
  return (
    <>
      <View style={s.vehicleBox}>
        <Text style={s.vehicleModel}>{model}</Text>
        <Text style={s.vehicleNumber}>{number}</Text>
      </View>

      <View style={s.buttonRow}>
        {isEditMode ? (
          <>
            <Pressable style={s.topBtn} onPress={onCancel}>
              <Text style={s.topBtnText}>취소하기</Text>
            </Pressable>
            <Pressable
              style={[s.topBtn, { backgroundColor: colors.PRIMARY_50 }]}
              onPress={onSave}
            >
              <Text style={[s.topBtnText, { color: colors.WHITE }]}>
                저장하기
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable style={s.topBtn}>
              <Text style={s.topBtnText}>다운로드</Text>
            </Pressable>
            <Pressable style={s.topBtn} onPress={onEdit}>
              <Text style={s.topBtnText}>수정하기</Text>
            </Pressable>
          </>
        )}
      </View>
    </>
  );
};
