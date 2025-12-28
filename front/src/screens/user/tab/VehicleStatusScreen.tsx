import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  LayoutAnimation,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../constants/colors';
import { HIT_SLOP } from '../../../constants/touch';
import VehicleGarageWaitModal from '../../../components/vehicleStatus/VehicleGarageWaitModal';
import { useContractModalStore } from '../../../stores/useContractModalStore';
import ContractModalManager from '../../../components/contract/ContractModalManager';
import { ContractVehicleBase } from '../../../types/contractVehicle';
import VehicleReturnRequestModal from '../../../components/vehicleStatus/VehicleReturnRequestModal';
import { usePartnerCars } from '../../../hooks/vehicleStatus/usePartnerCars';
import { usePartnerCarStatusSummary } from '../../../hooks/vehicleStatus/usePartnerCarStatusSummary';
import { PartnerCarItem } from '../../../api/vehicleStatus';
import { useAuthStore } from '../../../states/useAuthStore';

type VehicleStatusLabel = '배차중' | '대기중' | '반납신청';

type Vehicle = {
  id: number;
  name: string;
  plateNumber: string;
  status: VehicleStatusLabel;
  lastUpdate: string;
  duration: string;
  location?: string;
  isGarage: boolean;
};

const statusMap = {
  전체: undefined,
  배차중: 'IN_USE',
  대기중: 'AVAILABLE',
  반납신청: 'RETURN_REQUESTED',
} as const;

const mapPartnerCarToVehicle = (car: PartnerCarItem): Vehicle => ({
  id: car.carId,
  name: car.model,
  plateNumber: car.carNum,
  status:
    car.carStatus === 'IN_USE'
      ? '배차중'
      : car.carStatus === 'AVAILABLE'
      ? '대기중'
      : '반납신청',
  lastUpdate: car.updatedAt,
  duration: car.timeAfterUpdate,
  location: car.locationName,
  isGarage: car.immediateDispatchable,
});

export default function VehicleStatusScreen() {
  const navigation = useNavigation<any>();

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [activeStatus, setActiveStatus] = useState<
    '전체' | '배차중' | '대기중' | '반납신청'
  >('전체');

  const userName = useAuthStore(s => s.user?.name);
  const apiStatus = statusMap[activeStatus];

  const { data: summary } = usePartnerCarStatusSummary();
  const { data: carListData } = usePartnerCars(apiStatus);

  const vehicles = carListData?.carList.map(mapPartnerCarToVehicle) ?? [];

  const [garageModalVisible, setGarageModalVisible] = useState(false);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const { openModal, setSelectedVehicle: setContractVehicle } =
    useContractModalStore();

  const toContractVehicleFromUser = (v: Vehicle): ContractVehicleBase => ({
    id: v.id,
    model: v.name,
    number: v.plateNumber,
    location: v.location,
    reserverName: null,
    isGarage: v.isGarage,
    status: v.status,
  });

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={s.container}>
      {/* 상단 상태 요약 */}
      <View style={s.summaryContainer}>
        {(
          [
            {
              label: '배차중',
              value: summary?.inUseNum ?? 0,
              color: colors.YELLOW_50,
            },
            {
              label: '대기중',
              value: summary?.waitingNum ?? 0,
              color: colors.PRIMARY_50,
            },
            {
              label: '반납신청',
              value: summary?.returnRequestedNum ?? 0,
              color: colors.RED_50,
            },
            {
              label: '전체',
              value: summary?.allNum ?? 0,
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

      {/* 차량 리스트 */}
      <FlatList
        data={vehicles}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        renderItem={({ item }) => {
          const isOpen = expanded[item.id];

          // ===== 상태별 플래그 =====
          const isAtMyCompany = item.location === userName; // 대기중 + 내 회사
          const isParked = item.status === '대기중' && !isAtMyCompany; // 대기중 + 주차장/타회사
          const isDispatchedRequestCompany =
            item.status === '배차중' && !item.isGarage; // 배차중 + 요청업체

          // ===== 화살표 표시 여부 =====
          const showArrow =
            (item.status === '배차중' && item.isGarage) ||
            (item.status === '대기중' && isAtMyCompany) ||
            item.status === '반납신청';

          // 버튼 표시 여부
          const showButtons = isOpen && showArrow;

          return (
            <Pressable
              onPress={() =>
                navigation.navigate('ContractIntegrated', {
                  contractId: item.id,
                })
              }
            >
              <View style={s.item}>
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

                <View style={s.itemBody}>
                  {/* 상단 영역 */}
                  <View style={s.itemTop}>
                    <View style={s.carInfo}>
                      <Text style={s.carName}>{item.name}</Text>
                      <View style={s.plateBadge}>
                        <Text style={s.plate}>{item.plateNumber}</Text>
                      </View>
                    </View>

                    <View style={s.rightWrap}>
                      {isParked || isDispatchedRequestCompany ? (
                        <View style={s.locationWrap}>
                          <Image
                            source={require('../../../assets/common/location.png')}
                            style={s.locationIcon}
                          />
                          <Text style={s.locationText}>{item.location}</Text>
                        </View>
                      ) : (
                        <View style={{ alignItems: 'flex-end' }}>
                          <View style={s.row}>
                            <Image
                              source={require('../../../assets/common/calendar.png')}
                              style={s.smallIcon}
                            />
                            <Text style={s.date}>{item.lastUpdate}</Text>
                          </View>
                          <View style={s.row}>
                            <Image
                              source={require('../../../assets/common/clock.png')}
                              style={s.smallIcon}
                            />
                            <Text style={s.time}>{item.duration}</Text>
                          </View>
                        </View>
                      )}

                      {/* 화살표 */}
                      {showArrow && (
                        <Pressable
                          hitSlop={HIT_SLOP.MEDIUM}
                          style={s.arrowWrap}
                          onPress={e => {
                            e.stopPropagation();
                            toggleExpand(item.id);
                          }}
                        >
                          <Image
                            source={require('../../../assets/common/down_arrow.png')}
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
                      )}
                    </View>
                  </View>

                  {/* 버튼 영역 */}
                  {showButtons && (
                    <View style={s.buttonRow}>
                      {/* 배차중 */}
                      {item.status === '배차중' && item.isGarage && (
                        <>
                          <Pressable
                            style={[s.actionBtn, s.grayBtn]}
                            onPress={() => {
                              setSelectedVehicle(item);
                              setReturnModalVisible(true);
                            }}
                          >
                            <Text style={s.actionText}>반납신청</Text>
                          </Pressable>

                          <Pressable
                            style={[s.actionBtn, s.blueBtn]}
                            onPress={() => {
                              setSelectedVehicle(item);
                              setGarageModalVisible(true);
                            }}
                          >
                            <Text style={s.actionText}>공업사대기</Text>
                          </Pressable>
                        </>
                      )}

                      {/* 대기중 + 내 회사 */}
                      {item.status === '대기중' && isAtMyCompany && (
                        <>
                          <Pressable
                            style={[s.actionBtn, s.grayBtn]}
                            onPress={() => {
                              setSelectedVehicle(item);
                              setReturnModalVisible(true);
                            }}
                          >
                            <Text style={s.actionText}>반납신청</Text>
                          </Pressable>

                          <Pressable
                            style={[s.actionBtn, s.blueBtn]}
                            onPress={() => {
                              setContractVehicle(
                                toContractVehicleFromUser(item),
                              );
                              openModal('insurance', 'direct');
                            }}
                          >
                            <Text style={s.actionText}>바로배차</Text>
                          </Pressable>
                        </>
                      )}

                      {/* 반납신청 */}
                      {item.status === '반납신청' && (
                        <Pressable style={[s.actionBtn, s.redBtn]}>
                          <Text style={s.actionText}>반납취소</Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          );
        }}
      />

      <ContractModalManager />

      {/* 공업사 대기 모달 */}
      {selectedVehicle && (
        <VehicleGarageWaitModal
          visible={garageModalVisible}
          onClose={() => setGarageModalVisible(false)}
          vehicle={selectedVehicle}
          companyName={userName ?? ''}
        />
      )}

      {selectedVehicle && (
        <VehicleReturnRequestModal
          visible={returnModalVisible}
          onClose={() => setReturnModalVisible(false)}
          vehicle={selectedVehicle}
          staffId={1}
          onSubmitSuccess={() => {
            setReturnModalVisible(false);
          }}
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
    paddingTop: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 18,
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
  value: { fontSize: 20, fontWeight: '600' },
  label: { fontSize: 12, color: colors.GRAY_70, marginTop: 2 },

  item: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: colors.WHITE,
  },
  statusBar: { width: 2, marginLeft: 4, marginVertical: 4 },
  itemBody: { flex: 1, paddingVertical: 8, paddingHorizontal: 12 },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  carName: { fontSize: 12, fontWeight: '500', color: colors.GRAY_60 },

  plateBadge: {
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  plate: { fontSize: 11, color: colors.GRAY_60 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date: { fontSize: 11, color: colors.GRAY_50 },
  time: { fontSize: 11, color: colors.GRAY_50 },
  smallIcon: { width: 12, height: 12 },

  rightWrap: { flexDirection: 'row', alignItems: 'center' },

  arrowIcon: { width: 16, height: 16, resizeMode: 'contain' },
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
  actionBtn: { padding: 8, borderRadius: 4 },
  grayBtn: { backgroundColor: colors.GRAY_60 },
  blueBtn: { backgroundColor: colors.PRIMARY_50 },
  redBtn: { backgroundColor: colors.RED_50 },
  actionText: { fontSize: 11, fontWeight: '400', color: colors.WHITE },

  // 위치 전용 스타일
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 11,
    color: colors.GRAY_50,
  },
});
