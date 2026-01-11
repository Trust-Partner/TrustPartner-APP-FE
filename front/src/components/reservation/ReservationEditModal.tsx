import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { Reservation } from '../../mock/reservationMock';
import CommonModal from '../common/CommonModal';
import dayjs from 'dayjs';

interface Props {
  visible: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onConfirm: (updated: {
    requester: string;
    rentalCompany: string;
    dispatchLocation: string;
  }) => void;
}

export default function ReservationEditModal({
  visible,
  reservation,
  onClose,
  onConfirm,
}: Props) {
  const [requester, setRequester] = useState('');
  const [rentalCompany, setRentalCompany] = useState('');
  const [dispatchLocation, setDispatchLocation] = useState('');

  useEffect(() => {
    if (reservation) {
      setRequester(reservation.requester);
      setRentalCompany(reservation.rentalCompany);
      setDispatchLocation(reservation.dispatchLocation);
    }
  }, [reservation]);

  if (!reservation) return null;

  return (
    <CommonModal
      visible={visible}
      title="예약 정보 수정"
      confirmText="저장"
      cancelText="취소"
      onCancel={onClose}
      onConfirm={() =>
        onConfirm({
          requester,
          rentalCompany,
          dispatchLocation,
        })
      }
    >
      {/* 예약 요약 */}
      <View style={s.summaryCard}>
        <Text style={s.carName}>{reservation.carName}</Text>
        <Text style={s.summaryText}>
          예약일시: {dayjs(reservation.date).format('M월 D일')} ·{' '}
          {reservation.time}
        </Text>
        <Text style={s.summaryText}>담당자: {reservation.manager}</Text>
      </View>

      {/* 입력 폼 */}
      <View style={s.field}>
        <Text style={s.label}>요청업체</Text>
        <TextInput
          value={requester}
          onChangeText={setRequester}
          style={s.input}
        />
      </View>

      <View style={s.field}>
        <Text style={s.label}>렌트차종</Text>
        <TextInput
          value={rentalCompany}
          onChangeText={setRentalCompany}
          style={s.input}
        />
      </View>

      <View style={s.field}>
        <Text style={s.label}>배차장소</Text>
        <TextInput
          value={dispatchLocation}
          onChangeText={setDispatchLocation}
          style={s.input}
        />
      </View>
      <View style={{ marginBottom: 12 }} />
    </CommonModal>
  );
}

const s = StyleSheet.create({
  summaryCard: {
    width: '100%',
    backgroundColor: colors.GRAY_05,
    borderRadius: 6,
    padding: 16,
    marginVertical: 16,
  },
  carName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.GRAY_80,
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_70,
    lineHeight: 25,
    textAlign: 'center',
  },
  field: {
    width: '100%',
    marginBottom: 8,
  },
  label: {
    fontSize: 17,
    color: colors.GRAY_60,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    paddingVertical: Platform.OS === 'android' ? 2 : 8,
    paddingHorizontal: 12,
    fontSize: 18,
    color: colors.GRAY_80,
  },
});
