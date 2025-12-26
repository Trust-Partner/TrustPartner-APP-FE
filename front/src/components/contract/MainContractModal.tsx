import React from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import { HIT_SLOP } from '../../constants/touch';
import { ContractVehicleBase } from '../../types/contractVehicle';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (
    type: 'general' | 'insurance' | 'replacement' | 'dispatch',
  ) => void;
  vehicle: ContractVehicleBase;
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

  const isRestricted = isBookmarked || isConfirmed;

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
        <Pressable
          onPress={onClose}
          hitSlop={HIT_SLOP.MEDIUM}
          style={s.closeBtn}
        >
          <Image
            source={require('../../assets/common/close.png')}
            style={s.closeIcon}
          />
        </Pressable>

        <View style={s.headerRow}>
          <Text style={s.title}>{model}</Text>
          {(isBookmarked || isConfirmed) && reserverName && (
            <Text style={s.reserverLabel}>예약자 : {reserverName}</Text>
          )}
        </View>
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

        {/* 버튼 영역 */}
        <View style={s.btnBox}>
          <ContractButton
            label="일반계약서 작성"
            icon={require('../../assets/common/file_icon.png')}
            disabled={isRestricted}
            onPress={() => onSelect('general')}
          />
          <ContractButton
            label="보험계약서 작성"
            icon={require('../../assets/common/file_icon.png')}
            onPress={() => onSelect('insurance')}
          />
          <ContractButton
            label="교체계약서 작성"
            icon={require('../../assets/common/replace.png')}
            onPress={() => onSelect('replacement')}
          />
          <ContractButton
            label="배차 확정"
            icon={require('../../assets/common/check.png')}
            disabled={isRestricted}
            onPress={() => onSelect('dispatch')}
          />
        </View>
      </View>
    </Modal>
  );
}

const ContractButton = ({
  label,
  icon,
  disabled,
  onPress,
}: {
  label: string;
  icon: any;
  disabled?: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={[s.btn, disabled && s.btnDisabled]}
  >
    <View style={s.btnInner}>
      <Image source={icon} style={[s.btnIcon, disabled && s.btnIconDisabled]} />
      <Text style={[s.btnText, disabled && s.btnTextDisabled]}>{label}</Text>
    </View>
  </Pressable>
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
  closeBtn: {
    alignSelf: 'flex-end',
    width: 16,
    height: 16,
    justifyContent: 'center',
    resizeMode: 'contain',
    marginRight: -8,
  },
  closeIcon: {
    width: 16,
    height: 16,
    tintColor: colors.GRAY_60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.GRAY_90,
  },
  reserverLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.PRIMARY_50,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.GRAY_90,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    columnGap: 14,
    borderRadius: 4,
    backgroundColor: colors.GRAY_10,
    marginVertical: 24,
  },
  infoText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_80,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.PRIMARY_50,
  },
  btnBox: {
    width: '100%',
  },
  btn: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  btnDisabled: {
    // backgroundColor: colors.GRAY_05,
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,
  },
  btnIcon: {
    width: 16,
    height: 16,
    tintColor: colors.GRAY_90,
    resizeMode: 'contain',
  },
  btnIconDisabled: {
    tintColor: colors.GRAY_40,
  },
  btnText: {
    fontSize: 11,
    color: colors.GRAY_90,
    fontWeight: '400',
    lineHeight: 15.4,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  btnTextDisabled: {
    color: colors.GRAY_40,
  },
});
