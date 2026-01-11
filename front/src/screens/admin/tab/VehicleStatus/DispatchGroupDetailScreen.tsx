import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Platform,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AppHeader from '../../../../components/common/AppHeader';
import { colors } from '../../../../constants/colors';
import { useContractModalStore } from '../../../../stores/useContractModalStore';
import ContractModalManager from '../../../../components/contract/ContractModalManager';
import BookmarkModal from '../../../../components/vehicleStatus/BookmarkModal';
import VehicleReturnModal from '../../../../components/vehicleStatus/VehicleReturnModal';
import { ContractVehicleBase } from '../../../../types/contractVehicle';
import { DispatchDetail } from '../../../../types/dispatch';
import { useDispatchCarsByGrade } from '../../../../hooks/vehicleStatus/useDispatchCarsByGrade';
import { mapDispatchCarItemToDetail } from '../../../../utils/dispatchMapping';

export default function DispatchGroupDetailScreen({ route }: any) {
  const navigation = useNavigation();
  const { openModal, setSelectedVehicle } = useContractModalStore();
  const { groupId, groupName } = route.params;
  const {
    data: apiData,
    isFetching,
    refetch,
    isLoading,
  } = useDispatchCarsByGrade(groupId);

  const data: DispatchDetail[] = useMemo(() => {
    if (!apiData) return [];
    return apiData.cars.map(mapDispatchCarItemToDetail);
  }, [apiData]);

  const totalCount = data.length;

  // 모달 상태
  const [bookmarkVisible, setBookmarkVisible] = useState(false);
  const [bookmarkTarget, setBookmarkTarget] = useState<DispatchDetail | null>(
    null,
  );
  const [returnVisible, setReturnVisible] = useState(false);

  // 계약서 연동
  const toContractVehicleFromDispatch = (
    v: DispatchDetail,
  ): ContractVehicleBase => ({
    carId: v.id,
    model: v.model,
    number: v.number,
    location: v.location,
    year: v.year,
    washed: v.washed,

    isConfirmed: v.isConfirmed,
    isBookmarked: v.isBookmarked,
    reserverName: v.reserverName,

    carDispatchId: v.carDispatchId,
    draftingContract: v.draftingContract,
    contractType: v.contractType,
    contractId: v.contractId,
  });

  const handleSelectVehicle = (item: DispatchDetail) => {
    setSelectedVehicle(toContractVehicleFromDispatch(item));
    openModal('main', 'main');
  };

  // 스와이프 처리
  const handleSwipeOpen = (rowKey: string, rowMap: any) => {
    const item = data.find(i => i.id.toString() === rowKey);
    if (!item) return;

    setBookmarkTarget(item);

    if (item.isConfirmed || item.isBookmarked) {
      setReturnVisible(true);
    } else {
      setBookmarkVisible(true);
    }

    rowMap[rowKey]?.closeRow?.();
  };

  const handleBookmarkClose = () => {
    setBookmarkVisible(false);
    refetch();
  };

  const handleReturnClose = (status?: 'returned') => {
    setReturnVisible(false);
    refetch();
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
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={refetch}
              />
            }
            contentContainerStyle={{
              flexGrow: 1,
            }}
          />
        </View>
      </View>

      <ContractModalManager onCloseComplete={refetch} />

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
          onClose={handleReturnClose}
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
    fontSize: 22,
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
    fontSize: 17,
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
    fontSize: 17,
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
    fontSize: 17,
    color: colors.GRAY_60,
  },
});
