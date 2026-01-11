import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors } from '../../../../constants/colors';
import AppHeader from '../../../../components/common/AppHeader';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminVehicleStatusStackParamList } from '../../../../navigations/admin/stacks/tabs/AdminVehicleStatusStack';
import { useVehicleSearchStore } from '../../../../stores/useVehicleSearchStore';
import { useCarStatusSummary } from '../../../../hooks/vehicleStatus/useCarStatusSummary';
import { useCarStatusLocation } from '../../../../hooks/vehicleStatus/useCarStatusLocation';
import { DispatchCarType } from '../../../../api/vehicleStatus';
import { useDispatchCarGrades } from '../../../../hooks/vehicleStatus/useCarGrades';

type NavProp = NativeStackNavigationProp<
  AdminVehicleStatusStackParamList,
  'VehicleStatusMain'
>;

export default function VehicleStatusScreen() {
  const hasMountedRef = useRef(false);
  const [tab, setTab] = useState<'dispatch' | 'status'>('dispatch');
  const { query, setQuery } = useVehicleSearchStore();

  // 배차하기 탭
  const [selectedType, setSelectedType] = useState<'sedan' | 'suv' | 'import'>(
    'sedan',
  );

  const CAR_TYPE_MAP: Record<'sedan' | 'suv' | 'import', DispatchCarType> = {
    sedan: 'DOMESTIC_SEDAN',
    suv: 'DOMESTIC_SUV',
    import: 'IMPORTED',
  };

  const carType = CAR_TYPE_MAP[selectedType];
  const dispatchGrades = useDispatchCarGrades(carType);

  // 차량현황 탭
  const statusSummary = useCarStatusSummary();
  const statusLocations = useCarStatusLocation(query);

  const isContentLoading =
    !hasMountedRef.current &&
    (tab === 'dispatch'
      ? dispatchGrades.isLoading
      : statusSummary.isLoading || statusLocations.isLoading);

  const isContentError =
    tab === 'dispatch'
      ? dispatchGrades.isError
      : statusSummary.isError || statusLocations.isError;

  if (!hasMountedRef.current && !isContentLoading) {
    hasMountedRef.current = true;
  }

  useFocusEffect(
    useCallback(() => {
      dispatchGrades.refetch();
      statusSummary.refetch();
      statusLocations.refetch();
    }, [carType, query]),
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <AppHeader
          centerContent={
            tab === 'status' ? (
              <View style={s.searchBox}>
                <Image
                  source={require('../../../../assets/common/search.png')}
                  style={s.searchIcon}
                />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="차량번호를 검색하세요"
                  placeholderTextColor={colors.GRAY_50}
                  style={s.headerSearchInput}
                />
              </View>
            ) : undefined
          }
        />

        <View style={s.container}>
          {isContentLoading ? (
            <View style={s.loadingContainer}>
              <ActivityIndicator size="small" color={colors.PRIMARY_50} />
            </View>
          ) : isContentError ? (
            <View style={s.container}>
              <Text style={s.errorText}>차량 정보를 불러올 수 없습니다.</Text>
              <Text style={s.errorSub}>
                네트워크 또는 서버 오류가 발생했습니다.
              </Text>

              <Pressable
                style={s.retryBtn}
                onPress={() => {
                  if (tab === 'dispatch') {
                    dispatchGrades.refetch();
                  } else {
                    statusSummary.refetch();
                    statusLocations.refetch();
                  }
                }}
              >
                <Text style={s.retryText}>다시 시도</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* 탭 버튼 */}
              <View style={s.buttonRow}>
                <Pressable
                  style={[s.btn, tab === 'dispatch' && s.activeBtn]}
                  onPress={() => setTab('dispatch')}
                >
                  <Text style={[s.btnText, tab === 'dispatch' && s.activeText]}>
                    배차하기
                  </Text>
                </Pressable>

                <Pressable
                  style={[s.btn, tab === 'status' && s.activeBtn]}
                  onPress={() => setTab('status')}
                >
                  <Text style={[s.btnText, tab === 'status' && s.activeText]}>
                    차량현황 확인
                  </Text>
                </Pressable>
              </View>

              {tab === 'dispatch' ? (
                <DispatchSection
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  list={dispatchGrades.data?.grades ?? []}
                  isFetching={dispatchGrades.isFetching}
                  refetch={dispatchGrades.refetch}
                />
              ) : (
                <StatusSection
                  summary={statusSummary.data}
                  locations={statusLocations.data ?? []}
                  isFetching={
                    statusSummary.isFetching || statusLocations.isFetching
                  }
                  refetchAll={() => {
                    statusSummary.refetch();
                    statusLocations.refetch();
                  }}
                />
              )}
            </>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

// 배차하기
function DispatchSection({
  selectedType,
  setSelectedType,
  list,
  isFetching,
  refetch,
}: {
  selectedType: 'sedan' | 'suv' | 'import';
  setSelectedType: (v: 'sedan' | 'suv' | 'import') => void;
  list: any[];
  isFetching: boolean;
  refetch: () => void;
}) {
  const navigation = useNavigation<NavProp>();

  return (
    <View style={{ flex: 1 }}>
      <View style={s.filterRow}>
        {[
          { label: '세단 배차에요', key: 'sedan' },
          { label: 'SUV 배차에요', key: 'suv' },
          { label: '수입차에요', key: 'import' },
        ].map(item => (
          <Pressable
            key={item.key}
            style={s.filterItem}
            onPress={() => setSelectedType(item.key as any)}
          >
            <View
              style={[
                s.checkBox,
                selectedType === item.key && s.checkBoxActive,
              ]}
            >
              {selectedType === item.key && <Text style={s.checkIcon}>✓</Text>}
            </View>
            <Text style={s.filterText}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={list}
        numColumns={2}
        keyExtractor={item => item.gradeId.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <Pressable
            style={s.card}
            disabled={item.totalCount === 0}
            onPress={() =>
              navigation.navigate('DispatchGroupDetail', {
                groupId: item.gradeId,
                groupName: item.gradeName,
                totalCount: item.totalCount,
                type: selectedType,
              })
            }
          >
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>{item.gradeName}</Text>
              <Text style={s.cardBadge}>{item.totalCount}대</Text>
            </View>

            <View style={s.badgeRow}>
              <Text style={[s.badge, s.badgeGreen]}>
                {item.likedOrConfirmedCount}
              </Text>
              <Text style={[s.badge, s.badgeBlue]}>
                {item.availableCount - item.likedOrConfirmedCount}
              </Text>
              <Image
                source={require('../../../../assets/common/right_arrow.png')}
                style={s.arrowIcon}
              />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

// 차량현황
function StatusSection({
  summary,
  locations,
  isFetching,
  refetchAll,
}: {
  summary: any;
  locations: any[];
  isFetching: boolean;
  refetchAll: () => void;
}) {
  const navigation = useNavigation<NavProp>();

  const stats = [
    { label: '배차중', value: summary?.inUseNum ?? 0, color: colors.YELLOW_50 },
    {
      label: '대기중',
      value: summary?.availableNum ?? 0,
      color: colors.PRIMARY_50,
    },
    {
      label: '반납신청',
      value: summary?.returnRequestedNum ?? 0,
      color: colors.RED_50,
    },
    { label: '전체', value: summary?.allNum ?? 0, color: colors.GRAY_90 },
  ];

  const getCardStyle = (item: any) => {
    if (item.all === 0) return s.cardGray;
    return s.cardBlue;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={s.statsRow}>
        {stats.map((item, index, arr) => (
          <React.Fragment key={item.label}>
            <View style={s.statBox}>
              <Text style={[s.statNum, { color: item.color }]}>
                {item.value}
              </Text>
              <Text style={s.statLabel}>{item.label}</Text>
            </View>
            {index !== arr.length - 1 && <View style={s.divider} />}
          </React.Fragment>
        ))}
      </View>

      <FlatList
        data={locations}
        numColumns={2}
        keyExtractor={item => item.locationId.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetchAll} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <Pressable
            style={[s.card, getCardStyle(item)]}
            onPress={() => {
              if (item.all === 0) return;
              navigation.navigate('VehicleCompanyDetail', {
                locationId: item.locationId,
                locationName: item.locationName,
              });
            }}
          >
            <View style={s.cardHeader}>
              <Text
                style={[
                  s.cardTitle,
                  item.all === 0 && { color: colors.GRAY_50 },
                ]}
              >
                {item.locationName}
              </Text>
            </View>

            <View style={s.badgeRow}>
              {item.inUse > 0 && (
                <Text style={[s.badge, s.badgeYellow]}>{item.inUse}</Text>
              )}
              {item.available > 0 && (
                <Text style={[s.badge, s.badgeBlue]}>{item.available}</Text>
              )}
              {item.returnRequested > 0 && (
                <Text style={[s.badge, s.badgeRed]}>
                  {item.returnRequested}
                </Text>
              )}
              <Image
                source={require('../../../../assets/common/right_arrow.png')}
                style={s.arrowIcon}
              />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.GRAY_00,
  },
  loading: {
    fontSize: 20,
    color: colors.GRAY_60,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.RED_50,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSub: {
    fontSize: 18,
    color: colors.GRAY_50,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 6,
  },
  retryText: {
    color: colors.PRIMARY_50,
    fontSize: 18,
    fontWeight: '600',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_20,
    borderRadius: 4,
    paddingHorizontal: 12,
  },
  searchIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: colors.GRAY_60,
    marginRight: 6,
  },
  headerSearchInput: {
    minWidth: 158,
    minHeight: 36,
    paddingVertical: 0,
    marginTop: -1.5,
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  btn: {
    width: '49%',
    borderWidth: 1,
    borderColor: colors.PRIMARY_50,
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: colors.PRIMARY_50,
  },
  btnText: {
    fontSize: 17,
    color: colors.PRIMARY_50,
    fontWeight: '500',
  },
  activeText: {
    color: colors.WHITE,
  },
  card: {
    width: '49%',
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  cardBlue: {
    backgroundColor: colors.PRIMARY_00,
    borderWidth: 1,
    borderColor: colors.PRIMARY_15,
  },
  cardWhite: {
    backgroundColor: colors.WHITE,
  },
  cardGray: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 28,
    color: colors.GRAY_90,
    marginRight: 8,
  },
  cardBadge: {
    fontSize: 17,
    lineHeight: 25,
    backgroundColor: colors.GRAY_10,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: colors.GRAY_60,
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
    fontWeight: '500',
    color: colors.GRAY_60,
  },
  badgeGreen: { backgroundColor: colors.GREEN_10 },
  badgeYellow: { backgroundColor: colors.YELLOW_00 },
  badgeBlue: { backgroundColor: colors.PRIMARY_10 },
  badgeRed: { backgroundColor: colors.RED_05 },
  arrowIcon: {
    width: 16,
    height: 16,
    marginLeft: 'auto',
    resizeMode: 'contain',
  },
  searchInput: {
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: colors.WHITE,
    paddingVertical: 12,
    borderRadius: 4,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_60,
  },
  divider: {
    width: 1,
    backgroundColor: colors.GRAY_15,
    alignSelf: 'stretch',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxActive: {
    borderColor: colors.PRIMARY_50,
    backgroundColor: colors.PRIMARY_50,
  },
  checkIcon: {
    color: colors.GRAY_00,
    fontSize: 8,
    fontWeight: '700',
    lineHeight: 20,
  },
  filterText: {
    marginRight: 8,
    color: colors.GRAY_80,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 25,
    marginBottom: 4,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
});
