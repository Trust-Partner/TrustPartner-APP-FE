import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useContractForm } from '../../hooks/useContractForm';

interface Props {
  onBack: () => void;
}

export default function InsuranceContractModal({ onBack }: Props) {
  const { formData, updateField, saveDraftData, step, nextStep, prevStep } =
    useContractForm('insurance');

  return (
    <Modal visible transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.container}>
          <Text style={s.title}>보험계약서 작성 (Step {step})</Text>

          {step === 1 && (
            <>
              <TextInput
                placeholder="고객 성함"
                value={formData.customerName}
                onChangeText={v => updateField('customerName', v)}
                style={s.input}
              />
              <TextInput
                placeholder="연락처"
                value={formData.phone}
                onChangeText={v => updateField('phone', v)}
                style={s.input}
              />
            </>
          )}

          {step === 2 && (
            <>
              <TextInput
                placeholder="보험사명"
                value={formData.insuranceCompany}
                onChangeText={v => updateField('insuranceCompany', v)}
                style={s.input}
              />
              <TextInput
                placeholder="접수번호"
                value={formData.claimNumber}
                onChangeText={v => updateField('claimNumber', v)}
                style={s.input}
              />
            </>
          )}

          <View style={s.footer}>
            {step > 1 && (
              <TouchableOpacity style={s.btn} onPress={prevStep}>
                <Text style={s.btnText}>이전</Text>
              </TouchableOpacity>
            )}
            {step < 2 ? (
              <TouchableOpacity style={s.btn} onPress={nextStep}>
                <Text style={s.btnText}>다음</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[s.btn, { backgroundColor: '#3352F2' }]}>
                <Text style={[s.btnText, { color: '#fff' }]}>완료</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={s.footer}>
            <TouchableOpacity style={s.btn} onPress={saveDraftData}>
              <Text style={s.btnText}>임시저장</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btn} onPress={onBack}>
              <Text style={s.btnText}>뒤로가기</Text>
            </TouchableOpacity>
          </View>
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
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
  },
  btnText: { color: '#333', fontWeight: '500' },
});
