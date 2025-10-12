import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { vehicleGroupList } from '../../../mock/vehicleStatusMock';
import {
  sedanDispatchList,
  suvDispatchList,
  importDispatchList,
} from '../../../mock/vehicleDispatchMock';
import { colors } from '../../../constants/colors';
import AppHeader from '../../../components/common/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VehicleStatusStackParamList } from '../../../navigations/admin/stacks/tabs/VehicleStatusStack';

type NavProp = NativeStackNavigationProp<
  VehicleStatusStackParamList,
  'VehicleStatusMain'
>;

export default function VehicleStatusScreen() {
  const [tab, setTab] = useState<'dispatch' | 'status'>('dispatch');
  const [query, setQuery] = useState('');

  return (
    <View style={{ flex: 1 }}>
      {/* 헤더 */}
      <AppHeader
        centerContent={
          tab === 'status' ? (
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="차량번호를 검색하세요"
              placeholderTextColor={colors.GRAY_40}
              style={s.headerSearchInput}
            />
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
  );
}

/* 배차하기 섹션 */
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
                source={require('../../../assets/admin-vehicle/right_arrow.png')}
                style={s.arrowIcon}
              />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

/* 차량현황 탭 */
function StatusSection() {
  const navigation = useNavigation<NavProp>();
  const data = vehicleGroupList;

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
        data={data}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Pressable
            style={s.card}
            onPress={() =>
              navigation.navigate('VehicleCompanyDetail', {
                companyId: item.id,
                companyName: item.name,
              })
            }
          >
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>{item.name}</Text>
            </View>
            <View style={s.badgeRow}>
              <Text style={[s.badge, s.badgeYellow]}>{item.assigned}</Text>
              <Text style={[s.badge, s.badgeBlue]}>{item.waiting}</Text>
              <Text style={[s.badge, s.badgeRed]}>{item.returning}</Text>
              <Image
                source={require('../../../assets/admin-vehicle/right_arrow.png')}
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
    paddingHorizontal: 16,
  },
  headerSearchInput: {
    width: 220,
    height: 36,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  btn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.PRIMARY_50,
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 4,
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
    width: '48%',
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
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
  badgeRed: { backgroundColor: colors.RED_00 },
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
  statBox: { alignItems: 'center', flex: 1 },
  statNum: { fontSize: 20, fontWeight: '600', color: '#3352F2' },
  statLabel: { fontSize: 11, fontWeight: '400', color: colors.GRAY_60 },
  divider: {
    width: 1,
    backgroundColor: colors.GRAY_15,
    alignSelf: 'stretch',
  },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkBoxActive: {
    borderColor: '#3352F2',
    backgroundColor: '#3352F2',
  },
  checkIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
  },
  filterText: {
    marginRight: 8,
    color: '#333',
    fontSize: 13,
    lineHeight: 15.4,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
});
