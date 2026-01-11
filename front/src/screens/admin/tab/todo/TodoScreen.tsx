import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../../constants/colors';
import {
  ReturnRequestCompany,
  WashFuelCompany,
} from '../../../../mock/todo/todoMock';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminTodoStackParamList } from '../../../../navigations/admin/stacks/tabs/AdminTodoStack';
import { useTodoReturns } from '../../../../hooks/todo/useTodoReturns';
import { useTodoFuelWash } from '../../../../hooks/todo/useTodoFuelWash';

export default function TodoScreen() {
  const route = useRoute<any>();
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminTodoStackParamList>>();

  const initialTab = route?.params?.initialTab ?? 'return';
  const [tab, setTab] = useState<'return' | 'wash'>(initialTab);

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.initialTab) {
        setTab(route.params.initialTab);
      }
    }, [route?.params?.initialTab]),
  );

  // API hooks
  const {
    data: returnData,
    isLoading: isLoadingReturns,
    error: returnError,
  } = useTodoReturns();
  const {
    data: fuelWashData,
    isLoading: isLoadingFuelWash,
    error: fuelWashError,
  } = useTodoFuelWash();

  /** API 데이터를 컴포넌트 구조로 변환 */
  const returnList: ReturnRequestCompany[] = useMemo(() => {
    if (!returnData?.locations) return [];
    return returnData.locations.map(location => ({
      id: location.locationId,
      name: location.locationName,
      totalCount: location.carAtLocationCount,
      immediateReturn: location.immediateReturnRequestCount,
      contactCustomer: location.callToCustomerRequestCount,
      todayPickup: location.byTodayReturnRequestCount,
      unprocessedPrevDay: location.unprocessedPreviousDay,
    }));
  }, [returnData]);

  const washFuelList: WashFuelCompany[] = useMemo(() => {
    if (!fuelWashData?.locations) return [];
    return fuelWashData.locations.map(location => ({
      id: location.locationId,
      name: location.locationName,
      totalCount: location.carAtLocationCount,
      washCount: location.needsWashCount,
      fuelCount: location.needsFuelCount,
      unprocessedPrevDay: location.unprocessedPreviousDay,
      isParkingLot: false, // API에 해당 필드가 없으므로 기본값 설정
    }));
  }, [fuelWashData]);

  /** 상단 탭의 전체 건수 */
  const totalReturnBadges = useMemo(() => {
    return returnList.reduce(
      (acc, cur) =>
        acc + cur.immediateReturn + cur.contactCustomer + cur.todayPickup,
      0,
    );
  }, [returnList]);

  const totalWFBadges = useMemo(() => {
    return washFuelList.reduce(
      (acc, cur) => acc + cur.washCount + cur.fuelCount,
      0,
    );
  }, [washFuelList]);

  /** 리스트 정렬 */
  const sortedReturnList = useMemo(() => {
    return [...returnList].sort((a, b) => {
      // 보라(전일 미처리) > 빨강(즉시반납) > 흰색
      if (a.unprocessedPrevDay && !b.unprocessedPrevDay) return -1;
      if (!a.unprocessedPrevDay && b.unprocessedPrevDay) return 1;
      if (a.immediateReturn > 0 && b.immediateReturn === 0) return -1;
      if (a.immediateReturn === 0 && b.immediateReturn > 0) return 1;
      return 0;
    });
  }, [returnList]);

  const sortedWashFuelList = useMemo(() => {
    return [...washFuelList].sort((a, b) => {
      // 보라(전일 미처리) > 파랑(주차장) > 흰색
      if (a.unprocessedPrevDay && !b.unprocessedPrevDay) return -1;
      if (!a.unprocessedPrevDay && b.unprocessedPrevDay) return 1;
      if (a.isParkingLot && !b.isParkingLot) return -1;
      if (!a.isParkingLot && b.isParkingLot) return 1;
      return 0;
    });
  }, [washFuelList]);

  /** 카드 배경색 */
  const getReturnCardStyle = (item: ReturnRequestCompany) => {
    if (item.unprocessedPrevDay) return s.cardPurple;
    if (item.immediateReturn > 0) return s.cardRed;
    return s.cardDefault;
  };
  const getWashFuelCardStyle = (item: WashFuelCompany) => {
    if (item.unprocessedPrevDay) return s.cardPurple;
    if (item.isParkingLot) return s.cardBlue;
    return s.cardDefault;
  };

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
            <View style={s.countBadge}>
              <Text style={s.countText}>{totalReturnBadges}</Text>
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
            <View style={s.countBadge}>
              <Text style={s.countText}>{totalWFBadges}</Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* 리스트 */}
      {tab === 'return' ? (
        isLoadingReturns ? (
          <View style={s.loadingContainer}>
            <ActivityIndicator size="large" color={colors.PRIMARY_50} />
          </View>
        ) : returnError ? (
          <View style={s.loadingContainer}>
            <Text style={s.errorText}>
              데이터를 불러오는 중 오류가 발생했습니다.
            </Text>
          </View>
        ) : (
          <FlatList<ReturnRequestCompany>
            data={sortedReturnList}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <Pressable
                style={[s.card, getReturnCardStyle(item)]}
                onPress={() =>
                  navigation.navigate('TodoReturnDetail', {
                    companyId: item.id,
                    companyName: item.name,
                  })
                }
              >
                <View style={s.cardHeader}>
                  <Text style={s.cardTitle}>{item.name}</Text>
                  <Text style={s.totalTag}>{item.totalCount}대</Text>
                </View>

                <View style={s.badgeRow}>
                  <Text style={[s.badge, s.badgeBlue]}>{item.todayPickup}</Text>
                  <Text style={[s.badge, s.badgeRed]}>
                    {item.immediateReturn}
                  </Text>
                  <Text style={[s.badge, s.badgeGreen]}>
                    {item.contactCustomer}
                  </Text>
                  <Image
                    source={require('../../../../assets/common/right_arrow.png')}
                    style={s.arrowIcon}
                  />
                </View>
              </Pressable>
            )}
          />
        )
      ) : isLoadingFuelWash ? (
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color={colors.PRIMARY_50} />
        </View>
      ) : fuelWashError ? (
        <View style={s.loadingContainer}>
          <Text style={s.errorText}>
            데이터를 불러오는 중 오류가 발생했습니다.
          </Text>
        </View>
      ) : (
        <FlatList<WashFuelCompany>
          data={sortedWashFuelList}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable
              style={[s.card, getWashFuelCardStyle(item)]}
              onPress={() =>
                navigation.navigate('TodoWashFuelDetail', {
                  companyId: item.id,
                  companyName: item.name,
                })
              }
            >
              <View style={s.cardHeader}>
                <Text style={s.cardTitle}>{item.name}</Text>
                <Text style={s.totalTag}>{item.totalCount}대</Text>
              </View>

              <View style={s.badgeRow}>
                <View style={[s.badgeWrap, s.badgeBlueBg]}>
                  <Image
                    source={require('../../../../assets/admin-todo/wash.png')}
                    style={s.badgeIcon}
                  />
                  <Text style={s.badgeText}>{item.washCount}</Text>
                </View>
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
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: { backgroundColor: colors.PRIMARY_50 },
  tabText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.PRIMARY_50,
    lineHeight: 25,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.PRIMARY_10,
  },
  countText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_60,
    lineHeight: 25,
  },
  card: {
    width: '49%',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: colors.GRAY_90,
    lineHeight: 28,
  },
  totalTag: {
    fontSize: 17,
    color: colors.GRAY_60,
    lineHeight: 25,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.GRAY_10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 17,
    color: colors.GRAY_80,
  },
  badgeBlue: { backgroundColor: colors.PRIMARY_10 },
  badgeRed: { backgroundColor: colors.RED_05 },
  badgeGreen: { backgroundColor: colors.GREEN_10 },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeBlueBg: { backgroundColor: colors.PRIMARY_10 },
  badgeRedBg: { backgroundColor: colors.RED_05 },
  badgeIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 4,
  },
  badgeText: {
    fontSize: 17,
    color: colors.GRAY_60,
    lineHeight: 25,
  },
  cardDefault: {
    backgroundColor: colors.WHITE,
  },
  cardPurple: {
    backgroundColor: '#F3EAF6',
    borderWidth: 1,
    borderColor: '#EBBCFF',
  },
  cardRed: {
    backgroundColor: colors.RED_00,
    borderWidth: 1,
    borderColor: colors.RED_10,
  },
  cardBlue: {
    backgroundColor: colors.PRIMARY_00,
    borderWidth: 1,
    borderColor: colors.PRIMARY_15,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    marginLeft: 'auto',
    resizeMode: 'contain',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 20,
    color: colors.GRAY_60,
    textAlign: 'center',
  },
});
