import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { colors } from '../../../constants/colors';
import { AlertItem, alertMock } from '../../../mock/alertMock';

export default function NotificationScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>(alertMock);

  const handleRead = (id: number) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <View style={s.container}>
      {/* 헤더 */}
      <View style={s.header}>
        <Image
          source={require('../../../assets/common/Notifications.png')}
          style={s.icon}
        />
        <Text style={s.title}>알림 목록</Text>
        <View style={s.badge}>
          <Text style={s.badgeText}>{unreadCount}개 새 알림</Text>
        </View>
      </View>

      <View style={s.alertBox}>
        <FlatList
          data={alerts}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleRead(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`${item.message}, ${item.time}`}
              accessibilityState={{ selected: item.read }}
              accessibilityHint={
                item.read ? undefined : '읽음으로 표시하려면 탭하세요'
              }
              style={[
                s.alertItem,
                !item.read && { backgroundColor: colors.PRIMARY_00 },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={s.message}>{item.message}</Text>
              </View>

              <View style={s.right}>
                <Text style={s.time}>{item.time}</Text>
                {!item.read && <View style={s.dot} />}
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyText}>알림이 없습니다.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: colors.GRAY_90,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.GRAY_90,
    lineHeight: 22.4,
    marginLeft: 12,
  },
  badge: {
    backgroundColor: colors.PRIMARY_10,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 12,
  },
  badgeText: {
    fontSize: 17,
    color: colors.GRAY_90,
    fontWeight: '400',
    lineHeight: 15.4,
  },
  alertBox: {
    borderWidth: 1,
    borderColor: colors.GRAY_15,
    borderRadius: 4,
    backgroundColor: colors.WHITE,
    padding: 12,
    flex: 1,
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_15,
  },
  message: {
    fontSize: 17,
    color: colors.GRAY_90,
    lineHeight: 15.4,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_70,
    lineHeight: 15.4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.BLACK,
    marginLeft: 6,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: colors.GRAY_50,
  },
});
