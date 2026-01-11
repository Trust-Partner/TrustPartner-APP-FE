import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  LayoutAnimation,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../../constants/colors';
import { WashFuelVehicle } from '../../../../mock/todo/todoWashFuelDetailMock';
import CommonModal from '../../../../components/common/CommonModal';
import { HIT_SLOP } from '../../../../constants/touch';
import { useTodoFuelWashDetail } from '../../../../hooks/todo/useTodoFuelWashDetail';
import { useCompleteFuelMutation } from '../../../../hooks/todo/useCompleteFuelMutation';
import { useCompleteWashMutation } from '../../../../hooks/todo/useCompleteWashMutation';

export default function TodoWashFuelDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { companyId, companyName } = route.params as {
    companyId: number;
    companyName: string;
  };

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [modal, setModal] = useState<{
    visible: boolean;
    type: 'wash' | 'fuel' | null;
    carId?: number;
  }>({ visible: false, type: null });

  const handleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

    const days = dayMatch ? Number(dayMatch[1]) : 0;
    const hours = hourMatch ? Number(hourMatch[1]) : 0;

    const parts: string[] = [];

    if (days > 0) {
      parts.push(`${days}일`);
    }

    if (hours > 0) {
      parts.push(`${hours}시간`);
    }

    return parts.join(' ');
  };

  // API hook
  const {
    data: fuelWashDetailData,
    isLoading,
    error,
  } = useTodoFuelWashDetail(companyId);

  // Mutation hooks
  const completeFuelMutation = useCompleteFuelMutation(companyId);
  const completeWashMutation = useCompleteWashMutation(companyId);

  const openModal = (type: 'wash' | 'fuel', carId: number) =>
    setModal({ visible: true, type, carId });

  const closeModal = () => setModal({ visible: false, type: null });

  const handleConfirm = () => {
    if (modal.type === 'fuel' && modal.carId) {
      completeFuelMutation.mutate(modal.carId, {
        onSuccess: () => {
          setModal({ visible: false, type: null });
        },
        onError: () => {
          setModal({ visible: false, type: null });
          Alert.alert('알림', '주유 완료 처리에 실패했습니다');
        },
      });
    } else if (modal.type === 'wash' && modal.carId) {
      completeWashMutation.mutate(modal.carId, {
        onSuccess: () => {
          setModal({ visible: false, type: null });
        },
        onError: () => {
          setModal({ visible: false, type: null });
          Alert.alert('알림', '세차 완료 처리에 실패했습니다');
        },
      });
    } else {
      setModal({ visible: false, type: null });
    }
  };

  // UI 타입 변환
  const data: WashFuelVehicle[] = useMemo(() => {
    if (!fuelWashDetailData?.carFuelWashes) return [];
    return fuelWashDetailData.carFuelWashes.map(car => {
      return {
        id: car.carId,
        name: car.carModel,
        plateNumber: car.carNumber,
        lastUpdate: car.requestedAt,
        duration: car.timeAfterUpdate,
        hasWash: car.needsWash,
        hasFuel: car.needsFuel,
      };
    });
  }, [fuelWashDetailData]);

  const getStatusColor = (item: { hasWash?: boolean; hasFuel?: boolean }) => {
    if (item.hasWash) return colors.PRIMARY_50;
    if (item.hasFuel) return colors.RED_50;
    return colors.GRAY_20;
  };

  return (
    <View style={s.container}>
      {/* 상단 헤더 */}
      <View style={s.subHeader}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Image
            source={require('../../../../assets/admin-vehicle/left_arrow.png')}
            style={s.backIcon}
          />
        </Pressable>
        <Text style={s.title}>{companyName} 세차/주유 차량</Text>
      </View>

      {/* 리스트 */}
      {isLoading ? (
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color={colors.PRIMARY_50} />
        </View>
      ) : error ? (
        <View style={s.loadingContainer}>
          <Text style={s.errorText}>
            데이터를 불러오는 중 오류가 발생했습니다.
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isOpen = !!expanded[item.id];
            return (
              <View style={s.item}>
                {/* 좌측 상태바 */}
                <View
                  style={[
                    s.statusBar,
                    { backgroundColor: getStatusColor(item) },
                  ]}
                />

                <View style={s.itemBody}>
                  {/* 상단 영역 */}
                  <View style={s.itemTop}>
                    <View style={s.carInfo}>
                      <Text style={s.carName}>{item.name}</Text>

                      <View style={s.iconRow}>
                        {item.hasWash && (
                          <Image
                            source={require('../../../../assets/admin-todo/wash.png')}
                            style={s.washIcon}
                          />
                        )}
                        {item.hasFuel && (
                          <Image
                            source={require('../../../../assets/admin-todo/fuel.png')}
                            style={s.fuelIcon}
                          />
                        )}
                      </View>

                      <View style={s.plateBadge}>
                        <Text style={s.plate}>{item.plateNumber}</Text>
                      </View>
                    </View>

                    {/* 날짜 + 시간 + 화살표 */}
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
                          handleExpand(item.id);
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

                  {/* 하단 버튼 */}
                  {isOpen && (
                    <View style={s.buttonRow}>
                      {item.hasWash && (
                        <Pressable
                          style={[s.actionBtn, s.blueBorderBtn]}
                          onPress={() => openModal('wash', item.id)}
                        >
                          <Text
                            style={[s.actionText, { color: colors.PRIMARY_50 }]}
                          >
                            세차완료
                          </Text>
                        </Pressable>
                      )}

                      {item.hasFuel && (
                        <Pressable
                          style={[s.actionBtn, s.redBorderBtn]}
                          onPress={() => openModal('fuel', item.id)}
                        >
                          <Text
                            style={[s.actionText, { color: colors.RED_50 }]}
                          >
                            주유완료
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}

      {/* 공용 모달 */}
      {modal.type && (
        <CommonModal
          visible={modal.visible}
          title={modal.type === 'wash' ? '세차 완료' : '주유 완료'}
          message={
            modal.type === 'wash'
              ? '해당 차량의 세차가 완료됐나요?'
              : '해당 차량의 주유가 완료됐나요?'
          }
          cancelText="취소"
          confirmText="확인"
          onCancel={closeModal}
          onConfirm={handleConfirm}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    paddingHorizontal: 20,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: colors.GRAY_00,
  },
  backBtn: { marginRight: 8 },
  backIcon: { width: 20, height: 20, resizeMode: 'contain' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.GRAY_90,
    lineHeight: 31,
    marginTop: Platform.OS === 'android' ? -2 : 0,
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
    width: 3,
    marginLeft: 4,
    marginVertical: 4,
    borderRadius: 2,
  },
  itemBody: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconRow: { flexDirection: 'row', gap: 4 },
  washIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    tintColor: colors.PRIMARY_50,
  },
  fuelIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    tintColor: colors.RED_50,
  },
  smallIcon: { width: 12, height: 12, resizeMode: 'contain' },
  carName: { fontSize: 18, fontWeight: '600', color: colors.GRAY_60 },
  plateBadge: {
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  plate: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_60,
    lineHeight: 25,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date: { fontSize: 17, fontWeight: '500', color: colors.GRAY_50 },
  time: { fontSize: 17, fontWeight: '500', color: colors.GRAY_50 },
  rightWrap: { flexDirection: 'row', alignItems: 'center' },
  arrowWrap: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: { width: 16, height: 16, resizeMode: 'contain' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  actionBtn: { padding: 12, borderRadius: 4 },
  blueBorderBtn: { borderWidth: 1, borderColor: colors.PRIMARY_50 },
  redBorderBtn: { borderWidth: 1, borderColor: colors.RED_50 },
  actionText: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 25,
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
