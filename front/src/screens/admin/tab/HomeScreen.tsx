import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors } from '../../../constants/colors';
import { mockAdminDashboard } from '../../../mock/adminDashboard';
import { useNavigation } from '@react-navigation/native';

import RotationIcon from '../../../assets/admin-home/rotation.png';
import CalendarIcon from '../../../assets/admin-home/calendar.png';
import CarIcon from '../../../assets/admin-home/car.png';
import WarningIcon from '../../../assets/admin-home/warning.png';
import ReturnIcon from '../../../assets/admin-home/return.png';
import dayjs from 'dayjs';
import { useAdminHome } from '../../../hooks/home/useAdminHome';

export default function AdminHomeScreen() {
  const navigation = useNavigation<any>();

  const date = dayjs().format('YYYY-MM-DD');
  const { data, isLoading, refetch, isFetching } = useAdminHome(date);

  const { alerts: initialAlerts } = mockAdminDashboard;
  const [alerts, setAlerts] = useState(initialAlerts);

  const topIcons = [RotationIcon, CalendarIcon];
  const middleIcons = [CarIcon, WarningIcon, ReturnIcon];

  if (isLoading || !data) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY_50} />
      </View>
    );
  }

  const summary = {
    top: [
      { label: '회전율', value: `${data.rotationRate}%` },
      { label: '이번달', value: `${data.monthlyDispatchCount}건` },
    ],
    middle: [
      { label: '배차중', value: data.inUseCarCount },
      { label: '대기중', value: data.availableCarCount },
      { label: '배차건', value: data.monthlyDispatchCount },
    ],
    bottom: [
      {
        label: '배차요청건',
        value: data.dispatchRequestCount,
        sub: '대기중',
      },
      {
        label: '반납신청',
        value: data.returnRequestCarCount,
        sub: '요청',
      },
      {
        label: '세차/주유',
        value: data.washFuelLocationCount,
        sub: '대기',
      },
      {
        label: '지급확정',
        value: data.billingPendingCount,
        sub: '미확정',
      },
      {
        label: '예약관리',
        value: data.RemainingReservationCount,
        sub: '잔여',
      },
    ],
  };

  const handleCardPress = (label: string) => {
    switch (label) {
      case '배차요청건':
        navigation.navigate('DispatchRequests');
        break;

      case '반납신청':
        navigation.navigate('Todo', {
          screen: 'TodoMain',
          params: { initialTab: 'return' },
        });
        break;

      case '세차/주유':
        navigation.navigate('Todo', {
          screen: 'TodoMain',
          params: { initialTab: 'wash' },
        });
        break;

      case '지급확정':
        navigation.navigate('AdminPrepay');
        break;

      case '예약관리':
        navigation.navigate('AdminReservations');
        break;

      default:
        console.log(`${label} 연결되지 않은 항목`);
    }
  };

  const handleAlertPress = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <ScrollView
      style={s.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
    >
      <View style={s.section}>
        <Text style={s.sectionTitle}>실시간 상황판</Text>
        <View style={{ marginBottom: 8 }} />

        {/* 상단 박스 */}
        <View style={s.rowBetween}>
          {summary.top.map((item, idx) => (
            <View key={item.label} style={s.topCard}>
              <View style={s.topCardContent}>
                <View style={s.topLeft}>
                  <Text style={s.cardLabel}>{item.label}</Text>
                  <Text style={s.cardValue}>{item.value}</Text>
                </View>
                <Image
                  source={topIcons[idx]}
                  style={s.topRightIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          ))}
        </View>
        <View style={s.rowBetween}>
          {summary.middle.map((item, idx) => (
            <View key={item.label} style={s.middleCard}>
              <Image
                source={middleIcons[idx]}
                style={s.cardIconImage}
                resizeMode="contain"
              />
              <Text style={s.cardLabel}>{item.label}</Text>
              <Text style={s.cardValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 하단 박스 */}
      <View style={s.section}>
        <View style={s.rowBetween}>
          {summary.bottom.slice(0, 2).map(item => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                s.bottomCardLarge,
                pressed && { backgroundColor: colors.PRIMARY_05 },
              ]}
              onPress={() => handleCardPress(item.label)}
            >
              <View style={s.valueCircle}>
                <Text style={s.cardValueBottom}>{item.value}</Text>
              </View>
              <Text style={s.cardLabel}>{item.label}</Text>
              <Text style={s.cardSub}>{item.sub}</Text>
            </Pressable>
          ))}
        </View>

        <View style={s.rowBetween}>
          {summary.bottom.slice(2).map(item => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                s.bottomCardSmall,
                pressed && { backgroundColor: colors.PRIMARY_05 },
              ]}
              onPress={() => handleCardPress(item.label)}
            >
              <View style={s.valueCircle}>
                <Text style={s.cardValueBottom}>{item.value}</Text>
              </View>
              <Text style={s.cardLabel}>{item.label}</Text>
              <Text style={s.cardSub}>{item.sub}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 알림 */}
      <View style={s.section}>
        <View style={s.alertHeader}>
          <Text style={s.sectionTitle}>미확인 알림내역</Text>
          <View style={s.newAlertBadge}>
            <Text style={s.newAlertText}>{alerts.length}개 새 알림</Text>
          </View>
        </View>

        <View style={s.alertContainer}>
          <FlatList
            data={alerts}
            keyExtractor={item => item.id.toString()}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleAlertPress(item.id)}
                style={s.alertItem}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: colors.GRAY_90,
                      fontWeight: '500',
                    }}
                  >
                    {item.message}
                  </Text>
                </View>

                <View style={s.alertRight}>
                  <Text style={s.alertTime}>{item.time}</Text>
                  <View style={s.unreadDot} />
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={s.emptyBox}>
                <Text style={s.emptyText}>새 알림이 없습니다.</Text>
              </View>
            }
          />
        </View>
      </View>
      <View style={{ marginBottom: 20 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.GRAY_00,
  },
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.BLACK,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  topCard: {
    width: '49%',
    backgroundColor: colors.PRIMARY_10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.PRIMARY_15,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  topCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLeft: {
    gap: 4,
  },
  topRightIcon: {
    width: 22,
    height: 22,
    tintColor: colors.PRIMARY_80,
  },
  middleCard: {
    width: '32%',
    gap: 4,
    backgroundColor: colors.PRIMARY_10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.PRIMARY_15,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cardIconImage: {
    width: 24,
    height: 24,
  },
  bottomCardLarge: {
    width: '49%',
    backgroundColor: colors.PRIMARY_00,
    borderRadius: 4,
    paddingVertical: 16,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.PRIMARY_15,
  },
  bottomCardSmall: {
    width: '32%',
    backgroundColor: colors.PRIMARY_00,
    borderRadius: 4,
    paddingVertical: 16,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.PRIMARY_15,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.PRIMARY_90,
  },
  cardValue: {
    fontSize: 30,
    fontWeight: '600',
    color: colors.BLACK,
  },
  valueCircle: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: colors.PRIMARY_10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValueBottom: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.PRIMARY_50,
  },
  cardSub: {
    fontSize: 17,
    color: colors.GRAY_80,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  newAlertBadge: {
    backgroundColor: colors.GRAY_15,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 12,
    marginTop: Platform.OS === 'android' ? 2 : 0,
  },
  newAlertText: {
    color: colors.BLACK,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '400',
  },
  alertContainer: {
    borderWidth: 1,
    borderColor: colors.GRAY_15,
    borderRadius: 4,
    backgroundColor: colors.WHITE,
    padding: 12,
    maxHeight: 180,
  },
  alertItem: {
    backgroundColor: colors.PRIMARY_00,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertTime: {
    color: colors.GRAY_80,
    fontSize: 17,
    marginLeft: 12,
  },
  alertRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.BLACK,
    marginLeft: 6,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: colors.GRAY_50,
    fontSize: 18,
  },
});
