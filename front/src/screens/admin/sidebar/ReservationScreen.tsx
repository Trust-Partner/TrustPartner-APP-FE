import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Image,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { colors } from '../../../constants/colors';
import CommonModal from '../../../components/common/CommonModal';
import AppHeader from '../../../components/common/AppHeader';
import ReservationEditModal from '../../../components/reservation/ReservationEditModal';

import { useReservationByDate } from '../../../hooks/reservation/useReservationByDate';
import { useReservationCalendar } from '../../../hooks/reservation/useReservationCalendar';
import { useReservationStatics } from '../../../hooks/reservation/useReservationStatics';
import { useDeleteReservation } from '../../../hooks/reservation/useDeleteReservation';
import { useUpdateReservation } from '../../../hooks/reservation/useUpdateReservation';

export default function ReservationDrawerScreen() {
  const today = dayjs().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(today);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /** 예약 통계 */
  const { data: statics } = useReservationStatics();

  const updateMutation = useUpdateReservation();
  const deleteMutation = useDeleteReservation();

  /** 캘린더 (월 단위) */
  const monthStart = dayjs(selectedDate).startOf('month').format('YYYY-MM-DD');
  const monthEnd = dayjs(selectedDate).endOf('month').format('YYYY-MM-DD');

  const { data: calendarMap } = useReservationCalendar({
    startDate: monthStart,
    endDate: monthEnd,
  });

  /** 선택 날짜 예약 목록 */
  const { data: reservationByDate } = useReservationByDate(selectedDate);

  const reservationList =
    reservationByDate?.carReserves.map(item => ({
      id: item.reserveId,
      date: dayjs(item.dispatchDateTime).format('YYYY-MM-DD'),
      time: dayjs(item.dispatchDateTime).format('HH:mm'),
      carName: item.carModel,
      manager: item.reserverName,
      requester: item.requestCompany,
      rentalCompany: item.rentalType,
      dispatchLocation: item.dispatchLocation,
    })) ?? [];

  const handleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleConfirmEdit = (payload: {
    requester: string;
    rentalCompany: string;
    dispatchLocation: string;
  }) => {
    if (!editTarget) return;

    updateMutation.mutate(
      {
        reserveId: editTarget.id,
        payload: {
          requestCompany: payload.requester,
          rentalType: payload.rentalCompany,
          dispatchLocation: payload.dispatchLocation,
        },
      },
      {
        onSuccess: () => {
          setEditTarget(null);
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ?? '예약 수정에 실패했습니다';

          Alert.alert('예약 수정 실패', message);
        },
      },
    );
  };

  const handlePressDelete = (id: number) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(deleteTarget, {
      onSuccess: () => {
        setShowDeleteModal(false);
        setDeleteTarget(null);
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ?? '예약 삭제에 실패했습니다';

        Alert.alert('예약 삭제 실패', message);
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        canGoBack
        centerContent={<Text style={s.header}>예약관리</Text>}
      />

      <View style={s.container}>
        {/* 요약 */}
        <View style={s.summaryBox}>
          <View style={s.summaryItem}>
            <Text style={s.summaryValue}>{statics?.todayCount ?? 0}</Text>
            <Text style={s.summaryLabel}>오늘 남은 예약</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={s.summaryValue}>{statics?.totalCount ?? 0}</Text>
            <Text style={s.summaryLabel}>전체 남은 예약</Text>
          </View>
        </View>

        {/* 달력 */}
        <Calendar
          hideExtraDays={false}
          disableAllTouchEventsForDisabledDays={false}
          markingType="custom"
          style={s.calendar}
          theme={{ arrowColor: colors.PRIMARY_50 }}
          dayComponent={({ date, state }) => {
            if (!date) return null;

            const isSelected = date.dateString === selectedDate;
            const isToday = date.dateString === today;
            const isReserved = !!calendarMap?.[date.dateString];
            const isOtherMonth = state === 'disabled';

            let bgColor = 'transparent';
            if (isSelected) bgColor = colors.PRIMARY_50;
            else if (isReserved)
              bgColor = isOtherMonth ? colors.PRIMARY_05 : colors.PRIMARY_10;

            const borderColor = isToday ? colors.PRIMARY_40 : 'transparent';
            const borderWidth = isToday ? 1 : 0;

            const textColor = isOtherMonth
              ? colors.GRAY_20
              : isSelected
              ? colors.WHITE
              : colors.GRAY_90;

            const dotColor = isOtherMonth
              ? colors.PRIMARY_30
              : isSelected
              ? colors.WHITE
              : colors.PRIMARY_50;

            return (
              <Pressable
                onPress={() => setSelectedDate(date.dateString)}
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: bgColor,
                  borderWidth,
                  borderColor,
                  borderRadius: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: textColor }}>{date.day}</Text>
                {isReserved && (
                  <View
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: dotColor,
                    }}
                  />
                )}
              </Pressable>
            );
          }}
        />

        {/* 예약 리스트 */}
        <View style={s.cardContainer}>
          <View style={s.cardContainerHeader}>
            <View style={s.headerRow}>
              <Image
                source={require('../../../assets/admin-reservation/cheak.png')}
                style={s.cheakIcon}
              />
              <Text style={s.headerTilte}>예약 현황</Text>
            </View>
            <Text style={s.headerDate}>
              {dayjs(selectedDate).format('M월 D일')} 예약 목록 (
              {reservationList.length}건)
            </Text>
          </View>

          {reservationList.length > 0 ? (
            <FlatList
              data={reservationList}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isOpen = !!expanded[item.id];
                return (
                  <View style={s.card}>
                    <Pressable
                      style={s.cardHeader}
                      onPress={() => handleExpand(item.id)}
                    >
                      <View style={s.cardRow}>
                        <Text style={s.carName}>{item.carName}</Text>
                        <Text style={s.time}>
                          {dayjs(item.date).format('M/D')} {item.time}
                        </Text>
                      </View>
                      <View style={s.cardRow}>
                        <Text style={s.managerName}>{item.manager}</Text>
                        <Image
                          source={require('../../../assets/common/down_arrow.png')}
                          style={[
                            s.arrowIcon,
                            {
                              transform: [
                                { rotate: isOpen ? '180deg' : '0deg' },
                              ],
                            },
                          ]}
                        />
                      </View>
                    </Pressable>

                    {isOpen && (
                      <View style={s.detailBox}>
                        <View style={s.detailHeaderRow}>
                          <Text style={s.detailText}>메모</Text>
                          <View style={s.detailRow}>
                            <Pressable onPress={() => setEditTarget(item)}>
                              <Image
                                source={require('../../../assets/admin-reservation/edit.png')}
                                style={s.smallIcon}
                              />
                            </Pressable>
                            <Pressable
                              onPress={() => handlePressDelete(item.id)}
                            >
                              <Image
                                source={require('../../../assets/admin-reservation/delete.png')}
                                style={s.smallIcon}
                              />
                            </Pressable>
                          </View>
                        </View>

                        <Text style={s.detailText}>
                          요청업체: {item.requester}
                        </Text>
                        <Text style={s.detailText}>
                          렌트차종: {item.rentalCompany}
                        </Text>
                        <Text style={s.detailText}>
                          배차장소: {item.dispatchLocation}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          ) : (
            <View style={s.emptyBox}>
              <Text style={s.emptyText}>
                해당 날짜에 예약된 차량이 없습니다
              </Text>
            </View>
          )}
        </View>

        {/* 수정 모달 */}
        <ReservationEditModal
          visible={!!editTarget}
          reservation={editTarget}
          onClose={() => setEditTarget(null)}
          onConfirm={handleConfirmEdit}
        />

        {/* 삭제 모달 */}
        <CommonModal
          visible={showDeleteModal}
          title="예약 삭제"
          message="예약을 삭제할까요?"
          cancelText="취소"
          confirmText="삭제"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    padding: 16,
  },
  header: {
    fontSize: 20,
    color: colors.GRAY_90,
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    width: '49%',
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.PRIMARY_50,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_60,
  },
  calendar: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cheakIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  headerTilte: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.GRAY_80,
    lineHeight: 16.8,
    marginTop: Platform.OS === 'android' ? -2 : 0,
    marginLeft: 4,
  },
  headerDate: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_80,
    lineHeight: 15.4,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    backgroundColor: colors.GRAY_05,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.GRAY_60,
    lineHeight: 16.8,
  },
  time: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.PRIMARY_50,
    lineHeight: 15.4,
    marginLeft: 8,
  },
  managerName: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_50,
    lineHeight: 15.4,
    marginRight: 10,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  detailBox: {
    borderTopWidth: 1,
    borderColor: colors.GRAY_10,
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 8,
    gap: 5,
  },
  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_50,
    lineHeight: 15.4,
    marginTop: Platform.OS === 'android' ? -1 : 0,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  smallIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.GRAY_40,
  },
});
