import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { colors } from '../../../constants/colors';
import { mockUserDashboard } from '../../../mock/userDashboard';
import { useNavigation } from '@react-navigation/native';

export default function UserHomeScreen() {
  const { summary, request, alerts: initialAlerts } = mockUserDashboard;
  const navigation = useNavigation<any>();
  const [alerts, setAlerts] = useState(initialAlerts);

  const handleAlertPress = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <ScrollView
      style={s.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
      alwaysBounceVertical={false}
    >
      <Text style={s.sectionTitle}>이번달 현황</Text>

      {/* 상단 박스 */}
      <View style={s.rowBetween}>
        <View style={s.card}>
          <View style={s.cardRow}>
            <View>
              <Text style={s.cardLabel}>{summary.top[0].label}</Text>
              <Text style={s.cardValue}>{summary.top[0].value}</Text>
            </View>
            <Image
              source={require('../../../assets/user-home/graph.png')}
              style={s.cardIcon}
            />
          </View>
        </View>

        <View style={s.card}>
          <View style={s.cardRow}>
            <View>
              <Text style={s.cardLabel}>{summary.top[1].label}</Text>
              <Text style={s.cardValue}>{summary.top[1].value}</Text>
            </View>
            <Image
              source={require('../../../assets/user-home/car.png')}
              style={s.cardIcon}
            />
          </View>
        </View>
      </View>

      <View style={s.rowBetween}>
        <View style={s.card}>
          <View style={s.cardRow}>
            <View>
              <Text style={s.cardLabel}>{summary.middle[0].label}</Text>
              <Text style={s.cardValue}>{summary.middle[0].value}</Text>
            </View>
            <Image
              source={require('../../../assets/user-home/file.png')}
              style={s.cardIcon}
            />
          </View>
        </View>

        <View style={s.card}>
          <View style={s.cardRow}>
            <View>
              <Text style={s.cardLabel}>{summary.middle[1].label}</Text>
              <Text style={s.cardValue}>{summary.middle[1].value}</Text>
            </View>
            <Image
              source={require('../../../assets/user-home/chart.png')}
              style={s.cardIcon}
            />
          </View>
        </View>
      </View>

      {/* 배차 요청 */}
      <Pressable
        style={({ pressed }) => [
          s.requestCard,
          pressed && { backgroundColor: colors.PRIMARY_05 },
        ]}
        onPress={() => navigation.navigate('DispatchRequests')}
      >
        {/* 파란색 원 배경 추가 */}
        <View style={s.requestIconCircle}>
          <Image
            source={require('../../../assets/user-home/file.png')}
            style={s.requestIcon}
          />
        </View>

        <Text style={s.requestTitle}>{request.title}</Text>
        <Text style={s.requestDesc}>{request.desc}</Text>
      </Pressable>

      {/* 알림 목록 */}
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
              <Text style={s.alertMessage}>{item.message}</Text>
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
      <View style={{ marginBottom: 20 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.BLACK,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  card: {
    width: '49%',
    backgroundColor: colors.PRIMARY_10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.PRIMARY_15,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.PRIMARY_90,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.BLACK,
  },
  cardIcon: {
    width: 24,
    height: 24,
    tintColor: colors.PRIMARY_90,
  },
  requestCard: {
    marginTop: 20,
    backgroundColor: colors.PRIMARY_00,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.PRIMARY_15,
  },
  requestIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: colors.PRIMARY_10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  requestIcon: {
    width: 24,
    height: 24,
    tintColor: colors.PRIMARY_50,
  },
  requestTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.GRAY_90,
    marginBottom: 8,
  },
  requestDesc: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_80,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  newAlertBadge: {
    backgroundColor: colors.GRAY_15,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 12,
    marginTop: Platform.OS === 'android' ? 2 : 0,
  },
  newAlertText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.BLACK,
    lineHeight: 15.4,
  },
  alertContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_15,
    borderRadius: 4,
    backgroundColor: colors.WHITE,
    padding: 8,
    maxHeight: 180,
  },
  alertItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: colors.PRIMARY_00,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 11,
    color: colors.GRAY_90,
    fontWeight: '500',
  },
  alertRight: { flexDirection: 'row', alignItems: 'center' },
  alertTime: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_80,
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
