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
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { colors } from '../../../constants/colors';
import { reservationMock } from '../../../mock/reservationMock';
import CommonModal from '../../../components/common/CommonModal';

export default function ReservationDrawerScreen() {
  const today = dayjs().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(today);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { todayLeft, totalLeft } = reservationMock.summary;
  const [reservationList, setReservationList] = useState(reservationMock.list);

  const filteredList = reservationList.filter(r => r.date === selectedDate);

  const handleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id], // 클릭된 항목만 toggle
    }));
  };

  const handlePressDelete = (id: number) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget !== null) {
      setReservationList(prev => prev.filter(r => r.id !== deleteTarget));
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  return (
    <View style={s.container}>
      <View style={s.summaryBox}>
        <View style={s.summaryItem}>
          <Text style={s.summaryValue}>{todayLeft}</Text>
          <Text style={s.summaryLabel}>오늘 남은 예약</Text>
        </View>
        <View style={s.summaryItem}>
          <Text style={s.summaryValue}>{totalLeft}</Text>
          <Text style={s.summaryLabel}>전체 남은 예약</Text>
        </View>
      </View>

      {/* 달력 */}
      <Calendar
        hideExtraDays={false}
        disableAllTouchEventsForDisabledDays={false}
        markingType="custom"
        style={s.calendar}
        theme={{
          arrowColor: colors.PRIMARY_50,
        }}
        dayComponent={({ date, state }) => {
          if (!date) return null;

          const isSelected = date.dateString === selectedDate;
          const isToday = date.dateString === today;
          const isReserved = reservationList.some(
            r => r.date === date.dateString,
          );
          const isOtherMonth = state === 'disabled';

          // 배경색
          let bgColor = 'transparent';
          if (isSelected) bgColor = colors.PRIMARY_50;
          else if (isReserved)
            bgColor = isOtherMonth ? colors.PRIMARY_05 : colors.PRIMARY_10;

          // 테두리색 (오늘)
          const borderColor = isToday ? colors.PRIMARY_40 : 'transparent';
          const borderWidth = isToday ? 1 : 0;

          // 글자색
          const textColor = isOtherMonth
            ? colors.GRAY_20
            : isSelected
            ? colors.WHITE
            : colors.GRAY_90;

          // 점색
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

      {/* 예약 현황 리스트 */}
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
            {filteredList.length}건)
          </Text>
        </View>
        {filteredList.length > 0 ? (
          <FlatList
            data={filteredList}
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
                            transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
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
                          <Pressable>
                            <Image
                              source={require('../../../assets/admin-reservation/edit.png')}
                              style={s.smallIcon}
                            />
                          </Pressable>
                          <Pressable onPress={() => handlePressDelete(item.id)}>
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
            <Text style={s.emptyText}>해당 날짜에 예약된 차량이 없습니다</Text>
          </View>
        )}
      </View>
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
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    padding: 16,
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
    fontSize: 20,
    fontWeight: '600',
    color: colors.PRIMARY_50,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
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
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_80,
    lineHeight: 16.8,
    marginTop: Platform.OS === 'android' ? -2 : 0,
    marginLeft: 4,
  },
  headerDate: {
    fontSize: 11,
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
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_60,
    lineHeight: 16.8,
  },
  time: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.PRIMARY_50,
    lineHeight: 15.4,
    marginLeft: 8,
  },
  managerName: {
    fontSize: 11,
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
    fontSize: 11,
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
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_40,
  },
});
