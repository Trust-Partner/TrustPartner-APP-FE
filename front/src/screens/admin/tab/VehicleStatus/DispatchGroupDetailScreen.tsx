import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AppHeader from '../../../../components/common/AppHeader';
import { colors } from '../../../../constants/colors';
import {
  dispatchDetailMock,
  DispatchDetail,
} from '../../../../mock/vehicleStatus/vehicleDispatchDetailMock';
import { useContractModalStore } from '../../../../stores/useContractModalStore';
import ContractModalManager from '../../../../components/contract/ContractModalManager';
import BookmarkModal from '../../../../components/vehicleStatus/BookmarkModal';
import VehicleReturnModal from '../../../../components/vehicleStatus/VehicleReturnModal';
import { ContractVehicleBase } from '../../../../types/contractVehicle';

export default function DispatchGroupDetailScreen({ route }: any) {
  const navigation = useNavigation();
  const { openModal, setSelectedVehicle } = useContractModalStore();
  const { groupId, groupName, type } = route.params;

  const toContractVehicleFromDispatch = (
    v: DispatchDetail,
  ): ContractVehicleBase => ({
    id: v.id,
    model: v.model,
    number: v.number,
    location: v.location,
    year: v.year,
    washed: v.washed,
    isConfirmed: v.isConfirmed,
    isBookmarked: v.isBookmarked,
    reserverName: v.reserverName,
  });

  const [data, setData] = useState<DispatchDetail[]>(
    (dispatchDetailMock[type as keyof typeof dispatchDetailMock] || []).filter(
      item => item.groupId === groupId,
    ),
  );

  const [bookmarkVisible, setBookmarkVisible] = useState(false);
  const [bookmarkTarget, setBookmarkTarget] = useState<DispatchDetail | null>(
    null,
  );
  const [returnVisible, setReturnVisible] = useState(false);

  const totalCount = data.length;

  const handleBookmarkClose = (status?: 'bookmarked' | 'booked') => {
    if (bookmarkTarget && status) {
      setData(prev =>
        prev.map(v =>
          v.id === bookmarkTarget.id
            ? {
                ...v,
                isBookmarked: status === 'bookmarked', // 찜(즉시)
                isBookedFuture: status === 'booked', // 예약(미래)
              }
            : v,
        ),
      );
    }
    setBookmarkVisible(false);
  };

  const handleSelectVehicle = (item: DispatchDetail) => {
    const normalized = toContractVehicleFromDispatch(item);
    setSelectedVehicle(normalized);
    openModal('main', 'main'); // origin=main
  };

  const handleSwipeOpen = (rowKey: string, rowMap: any) => {
    const item = data.find(i => i.id.toString() === rowKey);
    if (!item) return;

    const sideBarColor =
      item.isConfirmed || item.isBookmarked
        ? colors.GREEN_50
        : colors.PRIMARY_50;

    if (sideBarColor === colors.PRIMARY_50) {
      // 파란색: 찜/예약 모달
      setBookmarkTarget(item);
      setBookmarkVisible(true);
    } else {
      // 초록색: 반납 모달
      setBookmarkTarget(item);
      setReturnVisible(true);
    }

    rowMap[rowKey]?.closeRow?.();
  };

  const renderItem = ({ item }: { item: DispatchDetail }) => {
    const sideBarColor =
      item.isConfirmed || item.isBookmarked
        ? colors.GREEN_50
        : colors.PRIMARY_50;

    const rowBackground = item.isInWashArea ? colors.PRIMARY_00 : colors.WHITE;

    return (
      <Pressable onPress={() => handleSelectVehicle(item)}>
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
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader />
      <View style={s.container}>
        {/* 상단 헤더 */}
        <View style={s.subHeader}>
          <Pressable onPress={() => navigation.goBack()} style={s.backButton}>
            <Image
              source={require('../../../../assets/admin-vehicle/left_arrow.png')}
              style={{ width: 20, height: 20 }}
            />
          </Pressable>

          <Text style={s.title}>{groupName}</Text>

          <View style={s.countBadge}>
            <Text style={s.countText}>{totalCount}대</Text>
          </View>
        </View>

        {/* 테이블 */}
        <View style={s.tableWrapper}>
          <View style={s.tableHeader}>
            <Text style={[s.th, { flex: 66 }]}>차종</Text>
            <Text style={[s.th, { flex: 44 }]}>연식</Text>
            <Text style={[s.th, { flex: 74 }]}>번호</Text>
            <Text style={[s.th, { flex: 60 }]}>위치</Text>
            <Text style={[s.th, { flex: 44 }]}>세차</Text>
          </View>

          <SwipeListView
            data={data}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            renderHiddenItem={() => <View />}
            rightOpenValue={-70}
            disableRightSwipe
            onRowOpen={handleSwipeOpen}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <ContractModalManager />

      {bookmarkVisible && bookmarkTarget && (
        <BookmarkModal
          visible={bookmarkVisible}
          vehicle={bookmarkTarget}
          onClose={handleBookmarkClose}
        />
      )}

      {returnVisible && bookmarkTarget && (
        <VehicleReturnModal
          visible={returnVisible}
          vehicle={bookmarkTarget}
          onClose={() => setReturnVisible(false)}
        />
      )}
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
