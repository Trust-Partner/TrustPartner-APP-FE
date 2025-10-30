import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DispatchDetail } from '../../mock/vehicleStatus/vehicleDispatchDetailMock';

interface Props {
  onBack: () => void;
  vehicle: DispatchDetail;
}

export default function DispatchConfirmModal({ onBack }: Props) {
  return (
    <Modal visible transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.container}>
          <Text style={s.title}>배차 확정</Text>
          <Text style={s.text}>배차가 확정되었습니다.</Text>

          <TouchableOpacity
            style={[s.btn, { backgroundColor: '#3352F2' }]}
            onPress={onBack}
          >
            <Text style={[s.btnText, { color: '#fff' }]}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '75%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  text: { fontSize: 15, color: '#555', marginBottom: 20, textAlign: 'center' },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { fontWeight: '500' },
});
