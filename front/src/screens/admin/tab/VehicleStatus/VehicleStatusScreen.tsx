import React, { useState } from 'react';
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
  Platform,
} from 'react-native';
import { vehicleGroupList } from '../../../../mock/vehicleStatus/vehicleStatusMock';
import {
  sedanDispatchList,
  suvDispatchList,
  importDispatchList,
} from '../../../../mock/vehicleStatus/vehicleDispatchMock';
import { colors } from '../../../../constants/colors';
import AppHeader from '../../../../components/common/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VehicleStatusStackParamList } from '../../../../navigations/admin/stacks/tabs/VehicleStatusStack';
import { vehicleCompanyDetailMock } from '../../../../mock/vehicleStatus/vehicleCompanyDetailMock';
import { useVehicleSearchStore } from '../../../../stores/useVehicleSearchStore';

type NavProp = NativeStackNavigationProp<
  VehicleStatusStackParamList,
  'VehicleStatusMain'
>;

export default function VehicleStatusScreen() {
  const [tab, setTab] = useState<'dispatch' | 'status'>('dispatch');
  const { query, setQuery } = useVehicleSearchStore();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        {/* 헤더 */}
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
          {/* 상단 버튼 */}
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

          {tab === 'dispatch' ? <DispatchSection /> : <StatusSection />}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

// 배차하기
function DispatchSection() {
  const navigation = useNavigation<NavProp>();

  const [selectedType, setSelectedType] = useState<'sedan' | 'suv' | 'import'>(
    'sedan',
  );

  const data =
    selectedType === 'sedan'
      ? sedanDispatchList
      : selectedType === 'suv'
      ? suvDispatchList
      : importDispatchList;

  return (
    <View style={{ flex: 1 }}>
      {/* 필터 */}
      <View style={s.filterRow}>
        {[
          { label: '세단 배차에요', key: 'sedan' },
          { label: 'SUV 배차에요', key: 'suv' },
          { label: '수입차에요', key: 'import' },
        ].map(item => (
          <Pressable
            key={item.key}
            style={s.filterItem}
            onPress={() =>
              setSelectedType(item.key as 'sedan' | 'suv' | 'import')
            }
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

      {/* 리스트 */}
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <Pressable
            style={s.card}
            onPress={() =>
              navigation.navigate('DispatchGroupDetail', {
                groupId: item.id,
                groupName: item.name,
                totalCount: item.total,
                type: selectedType,
              })
            }
          >
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>{item.name}</Text>
              <Text style={s.cardBadge}>{item.total}대</Text>
            </View>

            <View style={s.badgeRow}>
              <Text style={[s.badge, s.badgeGreen]}>{item.ready}</Text>
              <Text style={[s.badge, s.badgeBlue]}>{item.active}</Text>
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
function StatusSection() {
  const navigation = useNavigation<NavProp>();
  const { query } = useVehicleSearchStore(); // 공유 검색어 사용
  const data = vehicleGroupList;

  // 검색 필터
  const filteredData = data.filter(company => {
    if (!query.trim()) return true;

    // 회사명 검색
    const lowerQuery = query.toLowerCase();
    if (company.name.toLowerCase().includes(lowerQuery)) return true;

    const companyDetail = vehicleCompanyDetailMock.find(
      detail => detail.companyId === company.id,
    );
    if (!companyDetail) return false;

    return companyDetail.vehicles.some(v =>
      v.plateNumber.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')),
    );
  });

  // 통계
  const totals = data.reduce(
    (acc, cur) => {
      acc.assigned += cur.assigned;
      acc.waiting += cur.waiting;
      acc.returning += cur.returning;
      acc.total += cur.assigned + cur.waiting + cur.returning;
      return acc;
    },
    { assigned: 0, waiting: 0, returning: 0, total: 0 },
  );

  const stats = [
    { label: '배차중', value: totals.assigned, color: colors.YELLOW_50 },
    { label: '대기중', value: totals.waiting, color: colors.PRIMARY_50 },
    { label: '반납신청', value: totals.returning, color: colors.RED_50 },
    { label: '전체', value: totals.total, color: colors.GRAY_90 },
  ];

  // 배경색
  const getCardStyle = (item: any) => {
    const total = item.assigned + item.waiting + item.returning;
    if (total === 0) return s.cardGray;
    if (
      item.type === 'normal' ||
      item.type === 'etc' ||
      item.type === 'parking'
    )
      return s.cardBlue;
    return s.cardWhite;
  };

  // 태그 노출
  const renderBadges = (item: any) => {
    switch (item.type) {
      case 'normal':
        return <Text style={[s.badge, s.badgeYellow]}>{item.assigned}</Text>;
      case 'parking':
        return <Text style={[s.badge, s.badgeBlue]}>{item.waiting}</Text>;
      default:
        return (
          <>
            <Text style={[s.badge, s.badgeYellow]}>{item.assigned}</Text>
            <Text style={[s.badge, s.badgeBlue]}>{item.waiting}</Text>
            <Text style={[s.badge, s.badgeRed]}>{item.returning}</Text>
          </>
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 통계 */}
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

      {/* 리스트 */}
      <FlatList
        data={filteredData}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const total = item.assigned + item.waiting + item.returning;
          const disabled = total === 0;

          return (
            <Pressable
              style={[s.card, getCardStyle(item)]}
              disabled={disabled}
              onPress={() =>
                !disabled &&
                navigation.navigate('VehicleCompanyDetail', {
                  companyId: item.id,
                  companyName: item.name,
                })
              }
            >
              <View style={s.cardHeader}>
                <Text
                  style={[s.cardTitle, disabled && { color: colors.GRAY_50 }]}
                >
                  {item.name}
                </Text>
              </View>

              <View style={s.badgeRow}>
                {!disabled && renderBadges(item)}
                {!disabled && (
                  <Image
                    source={require('../../../../assets/common/right_arrow.png')}
                    style={s.arrowIcon}
                  />
                )}
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_20,
    borderRadius: 4,
    paddingHorizontal: 8,
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
    fontSize: 13,
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
    padding: 10,
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: colors.PRIMARY_50,
  },
  btnText: {
    fontSize: 11,
    color: colors.PRIMARY_50,
    fontWeight: '400',
  },
  activeText: {
    color: colors.WHITE,
  },
  card: {
    width: '49%',
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingHorizontal: 12,
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
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16.8,
    color: colors.GRAY_90,
    marginRight: 8,
  },
  cardBadge: {
    fontSize: 11,
    lineHeight: 15.4,
    backgroundColor: colors.GRAY_10,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    color: colors.GRAY_60,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: '400',
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: colors.WHITE,
    paddingVertical: 8,
    borderRadius: 4,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '400',
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
    fontWeight: '600',
    lineHeight: 14,
  },
  filterText: {
    marginRight: 8,
    color: colors.GRAY_80,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15.4,
    marginBottom: 4,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
});
