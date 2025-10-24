import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../../components/common/AppHeader';
import { colors } from '../../../../constants/colors';
import {
  dispatchDetailMock,
  DispatchDetail,
} from '../../../../mock/vehicleStatus/vehicleDispatchDetailMock';
import { useContractModalStore } from '../../../../stores/useContractModalStore';
import ContractModalManager from '../../../../components/contract/ContractModalManager';

export default function DispatchGroupDetailScreen({ route }: any) {
  const navigation = useNavigation();
  const { openModal, setSelectedVehicle } = useContractModalStore();
  const { groupId, groupName, type } = route.params;

  const data: DispatchDetail[] = (
    dispatchDetailMock[type as keyof typeof dispatchDetailMock] || []
  ).filter(item => item.groupId === groupId);

  const totalCount = data.length;

  const handleSelectVehicle = (item: DispatchDetail) => {
    setSelectedVehicle(item);
    openModal('main');
  };

  const renderItem = ({ item }: { item: DispatchDetail }) => {
    // 상태 바 색상 구분
    const sideBarColor =
      item.isConfirmed || item.isBookmarked
        ? colors.GREEN_50 // 찜 또는 배차확정 → 초록색
        : colors.PRIMARY_50; // 기본 → 파란색

    const rowBackground = item.isInWashArea ? colors.PRIMARY_00 : colors.WHITE;

    return (
      <TouchableOpacity onPress={() => handleSelectVehicle(item)}>
        <View style={[s.row, { backgroundColor: rowBackground }]}>
          <View style={[s.sideBar, { backgroundColor: sideBarColor }]} />
          <View style={s.cellWrapper}>
            <Text style={[s.td, { flex: 66 }]}>{item.model}</Text>
            <Text style={[s.td, { flex: 44 }]}>{item.year}</Text>
            <Text style={[s.td, { flex: 74 }]}>{item.number}</Text>
            <Text style={[s.td, { flex: 60 }]}>{item.location}</Text>
            <Text
              style={[
                s.td,
                {
                  flex: 44,
                  color: item.washed ? colors.GREEN_50 : colors.RED_50,
                },
              ]}
            >
              {item.washed ? '○' : '✕'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader />
      <View style={s.container}>
        {/* 상단 헤더 */}
        <View style={s.subHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={s.backButton}
          >
            <Image
              source={require('../../../../assets/admin-vehicle/left_arrow.png')}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>

          <Text style={s.title}>{groupName}</Text>

          <View style={s.countBadge}>
            <Text style={s.countText}>{totalCount}대</Text>
          </View>
        </View>

        {/* 테이블 영역 */}
        <View style={s.tableWrapper}>
          <View style={s.tableHeader}>
            <Text style={[s.th, { flex: 66 }]}>차종</Text>
            <Text style={[s.th, { flex: 44 }]}>연식</Text>
            <Text style={[s.th, { flex: 74 }]}>번호</Text>
            <Text style={[s.th, { flex: 60 }]}>위치</Text>
            <Text style={[s.th, { flex: 44 }]}>세차</Text>
          </View>

          <FlatList
            data={data}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
          />
        </View>
      </View>

      <ContractModalManager />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: { marginRight: 8 },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.GRAY_90,
    lineHeight: 22.4,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  countBadge: {
    marginLeft: 8,
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    color: colors.GRAY_60,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15.4,
  },
  tableWrapper: {
    flex: 1,
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.GRAY_05,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  th: {
    fontWeight: '400',
    color: colors.GRAY_60,
    textAlign: 'center',
    fontSize: 11,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_10,
  },
  sideBar: {
    width: 2,
    marginLeft: 4,
    marginVertical: 4,
    borderRadius: 1,
  },
  cellWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 6,
    paddingRight: 12,
  },
  td: {
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 11,
    color: colors.GRAY_60,
  },
});
