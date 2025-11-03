import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import { DispatchDetail } from '../../mock/vehicleStatus/vehicleDispatchDetailMock';
import CommonModal from '../common/CommonModal';

interface Props {
  visible: boolean;
  onClose: (status?: 'bookmarked' | 'booked') => void;
  vehicle: DispatchDetail;
}

export default function BookmarkModal({ visible, onClose, vehicle }: Props) {
  const [isBooking, setIsBooking] = useState(false);
  const [date, setDate] = useState('2025-09-10 22:00');

  const [resultModal, setResultModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const handleConfirm = () => {
    if (!isBooking) {
      setResultModal({
        visible: true,
        title: '찜 완료',
        message: '차량 찜이 완료되었습니다',
      });
    } else {
      setResultModal({
        visible: true,
        title: '예약 완료',
        message: '차량 예약이 완료되었습니다',
      });
    }
  };

  const renderStep1 = () => (
    <>
      {/* 닫기 버튼 */}
      <TouchableOpacity onPress={() => onClose()}>
        <Image
          source={require('../../assets/common/close.png')}
          style={s.close}
        />
      </TouchableOpacity>

      <Text style={s.title}>해당 차량을 찜해둘까요?</Text>

      <View style={s.badgeRow}>
        <Text style={s.badge}>{vehicle.model}</Text>
        <Text style={s.badge}>{vehicle.number}</Text>
      </View>

      {/* 예약일정 체크 */}
      <TouchableOpacity
        style={s.checkboxRow}
        onPress={() => setIsBooking(!isBooking)}
        activeOpacity={0.8}
      >
        <View style={[s.checkbox, isBooking && s.checked]}>
          {isBooking && (
            <Image
              source={require('../../assets/common/check_white.png')}
              style={{ width: 8, height: 6 }}
            />
          )}
        </View>
        <Text style={s.label}>예약일정을 등록할게요</Text>
      </TouchableOpacity>

      {/* 예약일정 폼 영역 */}
      {isBooking && (
        <>
          {/* 요청업체/차종/장소 박스 */}
          <View style={s.bookingBox}>
            <Text style={s.textLine}>요청업체 :</Text>
            <Text style={s.textLine}>렌트차종 :</Text>
            <Text style={s.textLine}>배차장소 :</Text>
          </View>

          {/* 날짜 및 시각 영역 */}
          <View style={{ marginTop: 8 }}>
            <Text style={s.labelSmall}>배차 날짜 및 시각</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[s.bookingBox, { flexDirection: 'row' }]}
            >
              <Image
                source={require('../../assets/common/calendar.png')}
                style={s.dateIcon}
              />
              <Text style={s.dateText}>{date}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={s.btnRow}>
        <TouchableOpacity style={s.cancelBtn} onPress={() => onClose()}>
          <Text style={s.cancelText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.confirmBtn} onPress={handleConfirm}>
          <Text style={s.confirmText}>확인</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      statusBarTranslucent
      onBackdropPress={() => onClose()}
    >
      <View style={s.modal}>{renderStep1()}</View>

      <CommonModal
        visible={resultModal.visible}
        title={resultModal.title}
        message={resultModal.message}
        confirmText="확인"
        hideCancel
        onConfirm={() => {
          setResultModal({ visible: false, title: '', message: '' });
          onClose(isBooking ? 'booked' : 'bookmarked');
        }}
        onCancel={() =>
          setResultModal({ visible: false, title: '', message: '' })
        }
      />
    </Modal>
  );
}

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
    fontWeight: '500',
    color: colors.GRAY_90,
    textAlign: 'center',
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  badge: {
    backgroundColor: colors.PRIMARY_10,
    color: colors.PRIMARY_50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 4,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16.8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    marginRight: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.PRIMARY_50,
    borderColor: colors.PRIMARY_50,
  },
  label: {
    fontSize: 11,
    color: colors.GRAY_80,
    fontWeight: '400',
    lineHeight: 15.4,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  labelSmall: {
    fontSize: 11,
    color: colors.GRAY_80,
  },
  bookingBox: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  textLine: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    marginBottom: 2,
  },
  dateIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.GRAY_50,
    marginRight: 8,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    lineHeight: 15.4,
    marginTop: Platform.OS === 'android' ? -1 : 0,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.PRIMARY_50,
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.PRIMARY_50,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15.4,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: colors.PRIMARY_50,
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  confirmBtnFull: {
    marginTop: 20,
    backgroundColor: colors.PRIMARY_50,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: colors.WHITE,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15.4,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.GRAY_90,
    textAlign: 'center',
    marginTop: 4,
  },
  resultSub: {
    fontSize: 13,
    color: colors.GRAY_60,
    textAlign: 'center',
    marginTop: 8,
  },
});
