import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import { colors } from '../../../constants/colors';
import { mockAdminDashboard } from '../../../mock/adminDashboard';
import { useNavigation } from '@react-navigation/native';

import RotationIcon from '../../../assets/admin-home/rotation.png';
import CalendarIcon from '../../../assets/admin-home/calendar.png';
import CarIcon from '../../../assets/admin-home/car.png';
import WarningIcon from '../../../assets/admin-home/warning.png';
import ReturnIcon from '../../../assets/admin-home/return.png';

export default function AdminHomeScreen() {
  const { summary, alerts: initialAlerts } = mockAdminDashboard;
  const navigation = useNavigation();

  const topIcons = [RotationIcon, CalendarIcon];
  const middleIcons = [CarIcon, WarningIcon, ReturnIcon];

  const handleCardPress = (label: string) => {
    console.log(`${label} 카드 클릭됨`);
  };

  const [alerts, setAlerts] = useState(initialAlerts);

  // ✅ 클릭 시 해당 알림 제거
  const handleAlertPress = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.section}>
        <Text style={s.sectionTitle}>실시간 상황판</Text>

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
                      fontSize: 11,
                      color: colors.GRAY_90,
                      fontWeight: '500',
                    }}
                  >
                    {item.message}
                  </Text>
                </View>

                {/* 오른쪽: 시간 + ● */}
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
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.BLACK,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 8,
  },
  topCard: {
    width: '48%',
    backgroundColor: colors.PRIMARY_10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.PRIMARY_15,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLeft: {
    gap: 6,
  },
  topRightIcon: {
    width: 22,
    height: 22,
    tintColor: colors.PRIMARY_80,
  },
  middleCard: {
    width: '31%',
    gap: 4,
    backgroundColor: colors.PRIMARY_10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.PRIMARY_15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cardIconImage: {
    width: 24,
    height: 24,
  },
  bottomCardLarge: {
    width: '48%',
    backgroundColor: colors.PRIMARY_00,
    borderRadius: 4,
    paddingVertical: 12,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.PRIMARY_15,
  },
  bottomCardSmall: {
    width: '31%',
    backgroundColor: colors.PRIMARY_00,
    borderRadius: 4,
    paddingVertical: 12,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.PRIMARY_15,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.PRIMARY_90,
  },
  cardValue: {
    fontSize: 24,
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
    fontSize: 22,
    fontWeight: '600',
    color: colors.PRIMARY_50,
  },
  cardSub: {
    fontSize: 11,
    color: colors.GRAY_80,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  newAlertBadge: {
    backgroundColor: colors.GRAY_15,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 12,
  },
  newAlertText: {
    color: colors.BLACK,
    fontSize: 11,
    lineHeight: 15.4,
    fontWeight: '400',
  },
  alertContainer: {
    borderWidth: 1,
    borderColor: colors.GRAY_15,
    borderRadius: 4,
    backgroundColor: colors.WHITE,
    padding: 8,
    maxHeight: 180,
  },
  alertItem: {
    backgroundColor: colors.PRIMARY_00,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertTime: {
    color: colors.GRAY_80,
    fontSize: 11,
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
    paddingVertical: 20,
  },
  emptyText: {
    color: colors.GRAY_50,
    fontSize: 13,
  },
});
