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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../../constants/colors';
import { ReturnVehicleItem } from '../../../../mock/todo/todoReturnDetailMock';
import { HIT_SLOP } from '../../../../constants/touch';
import { useTodoReturnDetail } from '../../../../hooks/todo/useTodoReturnDetail';

export default function TodoReturnDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { companyId, companyName } = route.params as {
    companyId: number;
    companyName: string;
  };

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  // API hook
  const {
    data: returnDetailData,
    isLoading,
    error,
  } = useTodoReturnDetail(companyId);

  const handleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /** returnTaskType을 status로 변환 */
  const mapReturnTaskTypeToStatus = (
    returnTaskType: string,
  ): '즉시반납' | '고객연락' | '금일회수' => {
    switch (returnTaskType) {
      case 'IMMEDIATELY':
        return '즉시반납';
      case 'BY_TODAY':
        return '금일회수';
      case 'CALL_TO_CUSTOMER':
        return '고객연락';
      default:
        return '즉시반납';
    }
  };

  /** API 데이터를 컴포넌트 구조로 변환 */
  const data: ReturnVehicleItem[] = useMemo(() => {
    if (!returnDetailData?.carReturnRequests) return [];
    return returnDetailData.carReturnRequests.map(request => {
      const date = new Date(request.requestedAt);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const formattedDate = `${month}/${day} ${hours}:${minutes}`;

      return {
        id: request.carId,
        name: request.carModel,
        plateNumber: request.carNumber,
        lastUpdate: formattedDate,
        duration: request.timeAfterUpdate,
        status: mapReturnTaskTypeToStatus(request.returnTaskType),
      };
    });
  }, [returnDetailData]);

  const handleCollect = (vehicleId: number) => {
    console.log('회수 처리:', vehicleId);
    // TODO: 회수 API 연동
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '즉시반납':
        return colors.RED_50;
      case '고객연락':
        return colors.GREEN_50;
      case '금일회수':
        return colors.PRIMARY_50;
      default:
        return colors.GRAY_20;
    }
  };

  return (
    <View style={s.container}>
      <View style={s.subHeader}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Image
            source={require('../../../../assets/admin-vehicle/left_arrow.png')}
            style={s.backIcon}
          />
        </Pressable>
        <Text style={s.title}>{companyName} 반납신청 차량</Text>
      </View>

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
                    { backgroundColor: getStatusColor(item.status) },
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

                    {/* 날짜 + 시간 + 화살표 */}
                    <View style={s.rightWrap}>
                      <View style={{ alignItems: 'flex-end' }}>
                        <View style={s.row}>
                          <Image
                            source={require('../../../../assets/common/calendar.png')}
                            style={s.smallIcon}
                          />
                          <Text style={s.date}>{item.lastUpdate}</Text>
                        </View>
                        <View style={s.row}>
                          <Image
                            source={require('../../../../assets/common/clock.png')}
                            style={s.smallIcon}
                          />
                          <Text style={s.time}>{item.duration}</Text>
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

                  {/* 하단 버튼 영역 */}
                  {isOpen && (
                    <View style={s.buttonRow}>
                      <Pressable
                        style={[s.actionBtn, s.blueBtn]}
                        onPress={() => handleCollect(item.id)}
                      >
                        <Text style={[s.actionText, { color: colors.WHITE }]}>
                          회수하기
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            );
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
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: colors.GRAY_00,
  },
  backBtn: { marginRight: 8 },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.GRAY_90,
    lineHeight: 22.4,
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
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_60,
  },
  plateBadge: {
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  plate: {
    fontSize: 11,
    color: colors.GRAY_60,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 11,
    color: colors.GRAY_50,
  },
  time: {
    fontSize: 11,
    color: colors.GRAY_50,
  },
  smallIcon: {
    width: 12,
    height: 12,
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
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
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
    fontSize: 11,
    fontWeight: '400',
    color: colors.WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: colors.GRAY_60,
    textAlign: 'center',
  },
});
