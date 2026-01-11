import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  LayoutAnimation,
  TextInput,
  Platform,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../../constants/colors';
import AppHeader from '../../../../components/common/AppHeader';
import VehicleReplaceModal from '../../../../components/vehicleStatus/VehicleReplaceModal';
import VehicleRetrieveModal from '../../../../components/vehicleStatus/VehicleRetrieveModal';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigations/root/RootNavigator';
import { HIT_SLOP } from '../../../../constants/touch';
import { useVehicleSearchStore } from '../../../../stores/useVehicleSearchStore';
import { useCarStatusByLocation } from '../../../../hooks/vehicleStatus/useCarStatusByLocation';
import { useCarsByLocation } from '../../../../hooks/vehicleStatus/useCarsByLocation';

export default function VehicleCompanyDetailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { locationId, locationName } = route.params as {
    locationId: number;
    locationName: string;
  };

  const { query, setQuery, clearQuery } = useVehicleSearchStore();
  useEffect(() => {
    return () => clearQuery();
  }, []);

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [activeStatus, setActiveStatus] = useState<
    '전체' | '배차중' | '대기중' | '반납신청'
  >('전체');

  const [replaceModalVisible, setReplaceModalVisible] = useState(false);
  const [retrieveModalVisible, setRetrieveModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const {
    data: summary,
    isFetching,
    refetch,
    isLoading,
  } = useCarStatusByLocation(locationId);
  const { data: carStatusGroups = [] } = useCarsByLocation(locationId, query);

  const mappedVehicles = carStatusGroups.flatMap(group => {
    const status =
      group.carStatus === 'IN_USE'
        ? '배차중'
        : group.carStatus === 'AVAILABLE'
        ? '대기중'
        : '반납신청';

    return group.carListByLocation.map(car => ({
      carId: car.carId,
      status,
      name: car.carModel,
      plateNumber: car.carNum,
      lastUpdate: car.updatedAt,
      duration: car.timeAfterUpdate,

      contractId: car.contractId,
      contractType: car.contractType,
    }));
  });

  const filteredVehicles = mappedVehicles.filter(v => {
    const statusMatch =
      activeStatus === '전체' ? true : v.status === activeStatus;

    const searchMatch = query.trim()
      ? v.name.toLowerCase().includes(query.toLowerCase()) ||
        v.plateNumber.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''))
      : true;

    return statusMatch && searchMatch;
  });

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month}/${day} ${hours}:${minutes}`;
  };

  const formatDuration = (raw: string) => {
    if (!raw) return '';

    const dayMatch = raw.match(/(\d+)d/);
    const hourMatch = raw.match(/(\d+)h/);

    const days = dayMatch ? dayMatch[1] : '0';
    const hours = hourMatch ? hourMatch[1] : '0';

    return `${days}일 ${hours}시간`;
  };

  const handlePressVehicle = (
    contractId?: number | null,
    contractType?: 'GENERAL_CONTRACT' | 'INSURANCE_CONTRACT' | null,
  ) => {
    if (!contractId || !contractType) {
      return;
    }

    navigation.navigate('ContractIntegrated', {
      contractId,
      contractType:
        contractType === 'INSURANCE_CONTRACT' ? 'INSURANCE' : 'GENERAL',
    });
  };

  const handleExpand = (carId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({ ...prev, [carId]: !prev[carId] }));
  };
  console.log(JSON.stringify(carStatusGroups, null, 2));

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        centerContent={
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="차량번호를 검색하세요"
            placeholderTextColor={colors.GRAY_40}
            style={s.headerSearchInput}
          />
        }
      />

      {/* 헤더 */}
      <View style={s.subHeader}>
        <Pressable onPress={() => navigation.goBack()} style={s.backButton}>
          <Image
            source={require('../../../../assets/admin-vehicle/left_arrow.png')}
            style={{ width: 20, height: 20 }}
          />
        </Pressable>

        <Text style={s.title}>{locationName}</Text>
      </View>

      <View style={s.container}>
        <View style={s.summaryContainer}>
          {(
            [
              {
                label: '배차중',
                value: summary?.inUse ?? 0,
                color: colors.YELLOW_50,
              },
              {
                label: '대기중',
                value: summary?.available ?? 0,
                color: colors.PRIMARY_50,
              },
              {
                label: '반납신청',
                value: summary?.returnRequested ?? 0,
                color: colors.RED_50,
              },
              {
                label: '전체',
                value: summary?.all ?? 0,
                color: colors.GRAY_90,
              },
            ] as const
          ).map((box, idx) => {
            const isActive = activeStatus === box.label;
            return (
              <Pressable
                key={box.label}
                style={[s.summaryCell, idx !== 3 && s.rightDivider]}
                onPress={() => setActiveStatus(box.label)}
              >
                <Text style={[s.value, { color: box.color }]}>{box.value}</Text>
                <Text style={s.label}>{box.label}</Text>
                {isActive && <View style={s.activeBorder} />}
              </Pressable>
            );
          })}
        </View>

        <FlatList
          data={filteredVehicles}
          keyExtractor={item => item.carId.toString()}
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
          renderItem={({ item }) => {
            const isOpen = expanded[item.carId];
            const isDispatched = item.status === '배차중';
            const isClickable = !!item.contractId;

            return (
              <Pressable
                disabled={!isClickable}
                onPress={() =>
                  handlePressVehicle(item.contractId, item.contractType)
                }
              >
                <View style={s.item}>
                  {/* 상태바 */}
                  <View
                    style={[
                      s.statusBar,
                      item.status === '배차중' && {
                        backgroundColor: colors.YELLOW_50,
                      },
                      item.status === '대기중' && {
                        backgroundColor: colors.PRIMARY_50,
                      },
                      item.status === '반납신청' && {
                        backgroundColor: colors.RED_50,
                      },
                    ]}
                  />

                  {/* 본문 */}
                  <View style={s.itemBody}>
                    {/* 상단 */}
                    <View style={s.itemTop}>
                      <View style={s.carInfo}>
                        <Text style={s.carName}>{item.name}</Text>
                        <View style={s.plateBadge}>
                          <Text style={s.plate}>{item.plateNumber}</Text>
                        </View>
                      </View>

                      {/* 오른쪽 날짜·시간 + 화살표 */}
                      <View style={s.rightWrap}>
                        <View style={{ alignItems: 'flex-end' }}>
                          <View style={s.row}>
                            <Image
                              source={require('../../../../assets/common/calendar.png')}
                              style={s.smallIcon}
                            />
                            <Text style={s.date}>
                              {formatDateTime(item.lastUpdate)}
                            </Text>
                          </View>
                          <View style={s.row}>
                            <Image
                              source={require('../../../../assets/common/clock.png')}
                              style={s.smallIcon}
                            />
                            <Text style={s.time}>
                              {formatDuration(item.duration)}
                            </Text>
                          </View>
                        </View>

                        <Pressable
                          hitSlop={HIT_SLOP.MEDIUM}
                          onPress={e => {
                            e.stopPropagation();
                            handleExpand(item.carId);
                          }}
                          style={s.arrowWrap}
                        >
                          <Image
                            source={require('../../../../assets/common/down_arrow.png')}
                            style={[
                              s.arrowIcon,
                              {
                                transform: [
                                  { rotate: isOpen ? '180deg' : '0deg' },
                                ],
                              },
                            ]}
                          />
                        </Pressable>
                      </View>
                    </View>

                    {/* 교체/회수 버튼 */}
                    {isOpen && (
                      <View style={s.buttonRow}>
                        {isDispatched && (
                          <Pressable
                            style={[s.actionBtn, s.grayBtn]}
                            onPress={() => {
                              setSelectedVehicle(item);
                              setReplaceModalVisible(true);
                            }}
                          >
                            <Text style={s.actionText}>교체하기</Text>
                          </Pressable>
                        )}

                        <Pressable
                          style={[s.actionBtn, s.blueBtn]}
                          onPress={() => {
                            setSelectedVehicle(item);
                            setRetrieveModalVisible(true);
                          }}
                        >
                          <Text style={s.actionText}>회수하기</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      </View>

      {/* 모달 */}
      {selectedVehicle && (
        <VehicleReplaceModal
          visible={replaceModalVisible}
          onClose={() => {
            setReplaceModalVisible(false);
            setSelectedVehicle(null);
          }}
          vehicle={selectedVehicle}
          locationId={locationId}
        />
      )}

      {selectedVehicle && (
        <VehicleRetrieveModal
          visible={retrieveModalVisible}
          onClose={() => {
            setRetrieveModalVisible(false);
            setSelectedVehicle(null);
          }}
          vehicle={selectedVehicle}
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.GRAY_00,
  },
  emptyText: {
    fontSize: 20,
    color: colors.GRAY_40,
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
    fontSize: 18,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: colors.GRAY_00,
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.GRAY_90,
    lineHeight: 22.4,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  summaryContainer: {
    flexDirection: 'row',
    borderWidth: 0,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.WHITE,
  },
  summaryCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: colors.WHITE,
    position: 'relative',
  },

  rightDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.GRAY_00,
  },
  activeBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: colors.GRAY_90,
    borderRadius: 4,
    zIndex: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: '600',
  },
  label: {
    fontSize: 18,
    color: colors.GRAY_70,
    marginTop: 2,
  },
  item: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: colors.WHITE,
  },
  statusBar: {
    width: 2,
    marginLeft: 4,
    marginVertical: 4,
  },
  itemBody: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  carName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.GRAY_60,
    lineHeight: 16.8,
  },
  plateBadge: {
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  plate: {
    fontSize: 17,
    color: colors.GRAY_60,
    fontWeight: '400',
    lineHeight: 15.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_50,
    lineHeight: 15.4,
  },
  time: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_50,
    lineHeight: 15.4,
  },
  smallIcon: {
    width: 12,
    height: 12,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  rightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowWrap: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 4,
  },
  grayBtn: {
    backgroundColor: colors.GRAY_60,
  },
  blueBtn: {
    backgroundColor: colors.PRIMARY_50,
  },
  actionText: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.WHITE,
    lineHeight: 15.4,
  },
});
