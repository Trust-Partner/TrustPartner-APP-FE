import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { colors } from '../../../constants/colors';
import CommonInput from '../../../components/common/CommonInput';
import CommonModal from '../../../components/common/CommonModal';
import { useUserDispatchMutation } from '../../../hooks/dispatch/useUserDispatchMutation';
import {
  carYearLabels,
  displacementLabels,
  yearLabelToEnum,
  displacementLabelToEnum,
} from '../../../utils/carMapping';

export default function DispatchRequestsScreen() {
  const [carInfo, setCarInfo] = useState('');
  const [year, setYear] = useState<string | null>(null);
  const [cc, setCc] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const isActive = !!(carInfo && year && cc);

  const dispatchMutation = useUserDispatchMutation();

  const handleConfirm = () => {
    if (!carInfo || !year || !cc) return;

    dispatchMutation.mutate(
      {
        carModel: carInfo,
        carYearGroup: yearLabelToEnum[year],
        displacementGroup: displacementLabelToEnum[cc],
      },
      {
        onSuccess: () => {
          setModalVisible(true);
        },
        onError: e => {
          Alert.alert('오류', '배차 요청에 실패했습니다.');
          console.log(e);
        },
      },
    );
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCarInfo('');
    setYear(null);
    setCc(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={s.container}>
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceVertical={false}
        >
          {/* 차량 정보 입력 */}
          <CommonInput
            placeholder="예시) 쏘나타 DN8"
            value={carInfo}
            onChangeText={setCarInfo}
          />
          <Text style={s.helperText}>
            고객 차량 정보를 입력하시면 빠른 배차가 가능합니다.
          </Text>

          {/* 차량 연식 선택 */}
          <Text style={s.sectionTitle}>고객 차량 연식을 선택해주세요</Text>
          <View style={s.radioGroup}>
            {carYearLabels.map(option => (
              <Pressable
                key={option}
                onPress={() =>
                  setYear(prev => (prev === option ? null : option))
                }
                style={[s.radioItem, year === option && s.radioItemActive]}
              >
                <Text style={s.radioLabel}>{option}</Text>
                <View style={[s.circle, year === option && s.circleActive]}>
                  {year === option && <View style={s.innerCircle} />}
                </View>
              </Pressable>
            ))}
          </View>

          {/* 차량 배기량 선택 */}
          <Text style={s.sectionTitle}>고객 차량 배기량을 선택해주세요</Text>
          <View style={s.grid}>
            {displacementLabels.map(option => (
              <Pressable
                key={option}
                onPress={() => setCc(prev => (prev === option ? null : option))}
                style={[s.gridItem, cc === option && s.gridItemActive]}
              >
                <Text style={s.gridLabel}>{option}</Text>
                <View style={[s.circle, cc === option && s.circleActive]}>
                  {cc === option && <View style={s.innerCircle} />}
                </View>
              </Pressable>
            ))}
          </View>

          {/* 배차 요청 버튼 */}
          <Pressable
            disabled={!isActive}
            style={[s.submitBtn, !isActive && s.submitBtnDisabled]}
            onPress={handleConfirm}
          >
            <Text style={s.submitText}>배차요청 확정</Text>
          </Pressable>
        </ScrollView>

        <CommonModal
          visible={modalVisible}
          title="배차 요청 완료"
          message="담당자가 곧 연락드릴게요."
          confirmText="돌아가기"
          hideCancel
          onConfirm={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
  },
  scrollContent: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 20,
    color: colors.BLACK,
  },
  helperText: {
    marginTop: -4,
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_50,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_80,
  },
  radioGroup: {
    marginTop: 8,
  },
  radioItem: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    backgroundColor: colors.GRAY_05,
    padding: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioItemActive: {
    borderColor: colors.PRIMARY_50,
    backgroundColor: colors.PRIMARY_10,
  },
  radioLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_80,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.GRAY_50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 4,
    height: 4,
    borderRadius: 10,
    backgroundColor: colors.WHITE,
  },
  circleActive: {
    backgroundColor: colors.PRIMARY_50,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  gridItem: {
    width: '49%',
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexDirection: 'row',
  },
  gridItemActive: {
    borderColor: colors.PRIMARY_50,
    backgroundColor: colors.PRIMARY_10,
  },
  gridLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_80,
  },
  gridCircle: {
    width: 12,
    height: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.GRAY_50,
  },
  gridCircleActive: {
    borderColor: colors.PRIMARY_50,
    backgroundColor: colors.PRIMARY_50,
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: colors.PRIMARY_50,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: colors.GRAY_15,
  },
  submitText: {
    fontSize: 17,
    color: colors.WHITE,
    fontWeight: '400',
  },
  submitTextDisabled: {
    color: colors.GRAY_40,
  },
});
