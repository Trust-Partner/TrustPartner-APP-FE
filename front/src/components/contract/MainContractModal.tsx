import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (
    type: 'general' | 'insurance' | 'replacement' | 'dispatch',
  ) => void;
  vehicle: {
    model: string;
    number: string;
    location: string;
    washed: boolean;
    isBookmarked: boolean;
    isConfirmed: boolean;
    reserverName?: string;
  };
}

export default function MainContractModal({
  visible,
  onClose,
  onSelect,
  vehicle,
}: Props) {
  const {
    model,
    number,
    location,
    washed,
    isBookmarked,
    isConfirmed,
    reserverName,
  } = vehicle;

  const isInsuranceOnly = isBookmarked || isConfirmed;

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      statusBarTranslucent
      onBackdropPress={onClose}
    >
      <View style={s.modal}>
        {/* 닫기 버튼 */}
        <TouchableOpacity onPress={onClose}>
          <Image
            source={require('../../assets/common/close.png')}
            style={s.close}
          />
        </TouchableOpacity>

        {/* 차량 정보 */}
        <Text style={s.title}>{model}</Text>
        <Text style={s.subTitle}>{number}</Text>

        <View style={s.infoBox}>
          <Text style={s.infoText}>
            • 위치 : <Text style={s.infoValue}>{location}</Text>
          </Text>
          <Text style={s.infoText}>
            • 세차 :{' '}
            <Text
              style={[
                s.infoValue,
                { color: washed ? colors.GREEN_50 : colors.RED_50 },
              ]}
            >
              {washed ? '○' : '✕'}
            </Text>
          </Text>
        </View>

        {(isBookmarked || isConfirmed) && reserverName && (
          <View style={s.reserverWrapper}>
            <Text style={s.reserverLabel}>예약자 :</Text>
            <Text style={s.reserverName}>{reserverName}</Text>
          </View>
        )}

        {/* 버튼 영역 */}
        <View style={s.btnBox}>
          <ContractButton
            label="일반계약서 작성"
            disabled={isInsuranceOnly}
            onPress={() => onSelect('general')}
          />
          <ContractButton
            label="보험계약서 작성"
            onPress={() => onSelect('insurance')}
          />
          <ContractButton
            label="교체계약서 작성"
            disabled={isInsuranceOnly}
            onPress={() => onSelect('replacement')}
          />
          <ContractButton
            label="배차 확정"
            disabled={isInsuranceOnly}
            onPress={() => onSelect('dispatch')}
          />
        </View>
      </View>
    </Modal>
  );
}

const ContractButton = ({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    disabled={disabled}
    style={[s.btn, disabled && s.btnDisabled]}
  >
    <Text style={[s.btnText, disabled && s.btnTextDisabled]}>{label}</Text>
  </TouchableOpacity>
);

const s = StyleSheet.create({
  modal: {
    backgroundColor: colors.WHITE,
    width: '100%',
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 32,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  close: {
    alignSelf: 'flex-end',
    width: 16,
    height: 16,
    tintColor: colors.GRAY_60,
    resizeMode: 'contain',
    marginRight: -8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.GRAY_90,
    textAlign: 'center',
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 14,
    color: colors.GRAY_60,
    textAlign: 'center',
    marginBottom: 14,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    columnGap: 12,
  },
  infoText: {
    fontSize: 13,
    color: colors.GRAY_70,
  },
  infoValue: {
    fontWeight: '500',
    color: colors.PRIMARY_50,
  },
  reserverWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 18,
  },
  reserverLabel: {
    fontSize: 13,
    color: colors.GRAY_70,
  },
  reserverName: {
    fontSize: 13,
    color: colors.PRIMARY_70,
    marginLeft: 4,
  },
  btnBox: {
    marginTop: 4,
    width: '100%',
  },
  btn: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnDisabled: {
    backgroundColor: colors.GRAY_05,
  },
  btnText: {
    fontSize: 14,
    color: colors.GRAY_90,
    fontWeight: '400',
  },
  btnTextDisabled: {
    color: colors.GRAY_40,
  },
});
