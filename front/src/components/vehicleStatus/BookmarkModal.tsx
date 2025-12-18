import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { colors } from '../../constants/colors';
import CommonModal from '../common/CommonModal';
import { HIT_SLOP } from '../../constants/touch';
import { DispatchDetail } from '../../types/dispatch';
import { useReserveCar } from '../../hooks/vehicleStatus/useReserveCar';
import { useAuthStore } from '../../states/useAuthStore';

interface Props {
  visible: boolean;
  onClose: (status?: 'bookmarked' | 'booked') => void;
  vehicle: DispatchDetail;
}

export default function BookmarkModal({ visible, onClose, vehicle }: Props) {
  const [isBooking, setIsBooking] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // 입력 필드 상태
  const [company, setCompany] = useState('');
  const [carModel, setCarModel] = useState('');
  const [location, setLocation] = useState('');

  const [resultModal, setResultModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const user = useAuthStore(s => s.user);
  const staffId = user?.kind === 'ADMIN' ? user.staffId : null;
  const { mutateAsync: reserveCarMutate, isPending } = useReserveCar();

  const times = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
  ];

  const dispatchDateTime = isBooking
    ? new Date(`${date}T${time}:00`).toISOString() // 예약
    : new Date().toISOString(); // 찜 (현재 시각)

  const handleConfirm = async () => {
    if (!staffId) return;

    if (isBooking) {
      if (!company || !carModel || !location) {
        setResultModal({
          visible: true,
          title: '입력 필요',
          message: '요청업체, 렌트차종, 배차장소를 모두 입력해주세요',
        });
        return;
      }

      if (!date || !time) {
        setResultModal({
          visible: true,
          title: '입력 필요',
          message: '배차 날짜와 시간을 모두 선택해주세요',
        });
        return;
      }
    }

    try {
      await reserveCarMutate({
        staffId,
        carId: vehicle.id,
        isReserved: isBooking,
        dispatchDateTime,

        ...(isBooking && {
          reserveRequest: {
            requestCompany: company,
            rentalType: carModel,
            dispatchLocation: location,
          },
        }),
      });

      setResultModal({
        visible: true,
        title: isBooking ? '예약 완료' : '찜 완료',
        message: isBooking
          ? `예약이 완료되었습니다\n(${date} ${time})`
          : '차량 찜이 완료되었습니다',
      });
    } catch (e) {
      console.log('reserveCar error:', e);
      setResultModal({
        visible: true,
        title: '요청 실패',
        message: '처리 중 오류가 발생했습니다',
      });
    }
  };

  const handleSelectDate = (d: any) => {
    setDate(d.dateString);
    setTime(null); // 날짜 변경 시 시간 초기화
  };

  const handleSelectTime = (t: string) => {
    setTime(t);
    setShowCalendar(false); // 시간까지 선택하면 달력 닫기
  };

  const renderBookingForm = () => (
    <>
      {/* 요청업체 / 렌트차종 / 배차장소 입력 */}
      <View style={s.inputGroup}>
        <Text style={s.labelSmall}>요청업체</Text>
        <TextInput
          value={company}
          onChangeText={setCompany}
          placeholder="요청업체명을 입력해주세요"
          placeholderTextColor={colors.GRAY_50}
          style={s.input}
        />

        <Text style={[s.labelSmall, { marginTop: 8 }]}>렌트차종</Text>
        <TextInput
          value={carModel}
          onChangeText={setCarModel}
          placeholder="렌트차종을 입력해주세요"
          placeholderTextColor={colors.GRAY_50}
          style={s.input}
        />

        <Text style={[s.labelSmall, { marginTop: 8 }]}>배차장소</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="배차장소를 입력해주세요"
          placeholderTextColor={colors.GRAY_50}
          style={s.input}
        />
      </View>

      {/* 날짜 및 시각 */}
      <View style={{ marginTop: 16 }}>
        <Text style={s.labelSmall}>배차 날짜 및 시각</Text>
        <Pressable
          style={[s.bookingBox, { flexDirection: 'row' }]}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Image
            source={require('../../assets/common/calendar.png')}
            style={s.dateIcon}
          />
          <Text style={s.dateText}>
            {date && time ? `${date} ${time}` : '날짜 및 시간을 선택해주세요'}
          </Text>
        </Pressable>
      </View>

      {/* 달력 + 시간 선택 */}
      {showCalendar && (
        <View style={s.calendarContainer}>
          <Calendar
            onDayPress={handleSelectDate}
            markedDates={{
              [date ?? '']: {
                selected: true,
                selectedColor: colors.PRIMARY_50,
              },
            }}
            theme={{
              arrowColor: colors.PRIMARY_50,
              todayTextColor: colors.PRIMARY_60,
              textDayFontSize: 13,
            }}
          />

          {date && (
            <View style={s.timeList}>
              {times.map(t => (
                <Pressable
                  key={t}
                  style={[
                    s.timeBtn,
                    t === time && { backgroundColor: colors.PRIMARY_50 },
                  ]}
                  onPress={() => handleSelectTime(t)}
                >
                  <Text
                    style={[s.timeText, t === time && { color: colors.WHITE }]}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      )}
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
      <View style={s.modal}>
        {/* 닫기 버튼 */}
        <Pressable onPress={() => onClose()} hitSlop={HIT_SLOP.MEDIUM}>
          <Image
            source={require('../../assets/common/close.png')}
            style={s.close}
          />
        </Pressable>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={s.title}>해당 차량을 찜해둘까요?</Text>

          <View style={s.badgeRow}>
            <Text style={s.badge}>{vehicle.model}</Text>
            <Text style={s.badge}>{vehicle.number}</Text>
          </View>

          {/* 예약일정 체크 */}
          <Pressable
            style={s.checkboxRow}
            onPress={() => setIsBooking(!isBooking)}
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
          </Pressable>

          {isBooking && renderBookingForm()}
        </ScrollView>

        <View style={s.btnRow}>
          <Pressable style={s.cancelBtn} onPress={() => onClose()}>
            <Text style={s.cancelText}>취소</Text>
          </Pressable>
          <Pressable style={s.confirmBtn} onPress={handleConfirm}>
            <Text style={s.confirmText}>확인</Text>
          </Pressable>
        </View>
      </View>

      <CommonModal
        visible={resultModal.visible}
        title={resultModal.title}
        message={resultModal.message}
        confirmText="확인"
        hideCancel
        onConfirm={() => {
          if (resultModal.title.includes('입력 필요')) {
            setResultModal({ visible: false, title: '', message: '' });
            return;
          }

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
    maxHeight: '90%',
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
  inputGroup: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_20,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 6 : 2,
    fontSize: 11,
    color: colors.GRAY_80,
    marginTop: 4,
  },
  bookingBox: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
    alignItems: 'center',
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
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  calendarContainer: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  timeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 6,
  },
  timeBtn: {
    borderWidth: 1,
    borderColor: colors.GRAY_20,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.WHITE,
  },
  timeText: {
    fontSize: 11,
    color: colors.GRAY_70,
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
  confirmText: {
    color: colors.WHITE,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15.4,
  },
});
