import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { colors } from '../../../../constants/colors';
import {
  returnRequestList,
  washFuelList,
} from '../../../../mock/todo/todoMock';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TodoStackParamList } from '../../../../navigations/admin/stacks/tabs/TodoStack';

export default function TodoScreen() {
  const [tab, setTab] = useState<'return' | 'wash'>('return');
  const navigation =
    useNavigation<NativeStackNavigationProp<TodoStackParamList>>();

  const data = tab === 'return' ? returnRequestList : washFuelList;

  const totalReturnBadges = returnRequestList.reduce(
    (acc, cur) =>
      acc + cur.immediateReturn + cur.contactCustomer + cur.todayPickup,
    0,
  );

  const totalWFBadges = washFuelList.reduce(
    (acc, cur) => acc + cur.washCount + cur.fuelCount,
    0,
  );

  return (
    <View style={s.container}>
      {/* 상단 탭 */}
      <View style={s.tabRow}>
        <Pressable
          style={[s.tabBtn, tab === 'return' && s.activeTab]}
          onPress={() => setTab('return')}
        >
          <View style={s.tabContent}>
            <Text style={[s.tabText, tab === 'return' && s.activeTabText]}>
              반납신청
            </Text>
            <View style={[s.countBadge]}>
              <Text style={[s.countText]}>{totalReturnBadges}</Text>
            </View>
          </View>
        </Pressable>

        <Pressable
          style={[s.tabBtn, tab === 'wash' && s.activeTab]}
          onPress={() => setTab('wash')}
        >
          <View style={s.tabContent}>
            <Text style={[s.tabText, tab === 'wash' && s.activeTabText]}>
              세차/주유
            </Text>
            <View style={[s.countBadge]}>
              <Text style={[s.countText]}>{totalWFBadges}</Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* 리스트 */}
      <FlatList
        data={data as any[]}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Pressable
            style={s.card}
            onPress={() => {
              if (tab === 'return') {
                navigation.navigate('TodoReturnDetail', {
                  companyId: item.id,
                  companyName: item.name,
                });
              } else {
                navigation.navigate('TodoWashFuelDetail', {
                  companyId: item.id,
                  companyName: item.name,
                });
              }
            }}
          >
            <Text style={s.cardTitle}>{item.name}</Text>

            {tab === 'return' ? (
              <View style={s.badgeRow}>
                <Text style={[s.badge, s.badgeRed]}>
                  {item.immediateReturn}
                </Text>
                <Text style={[s.badge, s.badgeGreen]}>
                  {item.contactCustomer}
                </Text>
                <Text style={[s.badge, s.badgeBlue]}>{item.todayPickup}</Text>
                <Image
                  source={require('../../../../assets/common/right_arrow.png')}
                  style={s.arrowIcon}
                />
              </View>
            ) : (
              <View style={s.badgeRow}>
                {/* 세차 뱃지 */}
                <View style={[s.badgeWrap, s.badgeBlueBg]}>
                  <Image
                    source={require('../../../../assets/admin-todo/wash.png')}
                    style={s.badgeIcon}
                  />
                  <Text style={s.badgeText}>{item.washCount}</Text>
                </View>

                {/* 주유 뱃지 */}
                <View style={[s.badgeWrap, s.badgeRedBg]}>
                  <Image
                    source={require('../../../../assets/admin-todo/fuel.png')}
                    style={s.badgeIcon}
                  />
                  <Text style={s.badgeText}>{item.fuelCount}</Text>
                </View>

                <Image
                  source={require('../../../../assets/common/right_arrow.png')}
                  style={s.arrowIcon}
                />
              </View>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.GRAY_00,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabBtn: {
    width: '49%',
    borderWidth: 1,
    borderColor: colors.PRIMARY_50,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.PRIMARY_50,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.PRIMARY_50,
    lineHeight: 15.4,
  },
  activeTabText: {
    color: colors.WHITE,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  countBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.PRIMARY_10,
  },
  countText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_60,
  },
  card: {
    width: '49%',
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16.8,
    color: colors.GRAY_90,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgeBlueBg: {
    backgroundColor: colors.PRIMARY_10,
  },
  badgeRedBg: {
    backgroundColor: colors.RED_00,
  },
  badgeIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    marginRight: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_60,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 11,
    color: colors.GRAY_80,
  },
  badgeBlue: { backgroundColor: colors.PRIMARY_10 },
  badgeRed: { backgroundColor: colors.RED_00 },
  badgeGreen: { backgroundColor: colors.GREEN_10 },
  arrowIcon: {
    width: 16,
    height: 16,
    marginLeft: 'auto',
    resizeMode: 'contain',
  },
});
