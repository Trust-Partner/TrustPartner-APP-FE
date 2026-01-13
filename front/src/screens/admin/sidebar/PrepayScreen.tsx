import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  LayoutAnimation,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../constants/colors';
import { PrepaymentItemType } from '../../../mock/prepaymentMock';
import CommonModal from '../../../components/common/CommonModal';
import AppHeader from '../../../components/common/AppHeader';
import { usePendingBillings } from '../../../hooks/billings/usePendingBillings';
import { useMonthlyDispatchBillings } from '../../../hooks/billings/useMonthlyDispatchBillings';
import { usePreviousDispatchBillings } from '../../../hooks/billings/usePreviousDispatchBillings';
import { useConfirmBilling } from '../../../hooks/billings/useConfirmBilling';
import { useCancelBillingRequest } from '../../../hooks/billings/useCancelBillingRequest';
import { DispatchBillingItem } from '../../../api/billings';
import { RootStackParamList } from '../../../navigations/root/RootNavigator';
import { ContractType } from '../../contract/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** duration 포맷팅 함수 (일 시간 분) */
const formatDuration = (
  daysElapsed: number,
  hoursElapsed: number,
  minutesElapsed: number,
): string => {
  const parts: string[] = [];
  if (daysElapsed > 0) {
    parts.push(`${daysElapsed}일`);
  }
  if (hoursElapsed > 0) {
    parts.push(`${hoursElapsed}시간`);
  }
  if (minutesElapsed > 0) {
    parts.push(`${minutesElapsed}분`);
  }
  return parts.length > 0 ? parts.join(' ') : '0분';
};

/** ContractType 변환 함수 */
const convertContractType = (
  contractType: string,
): ContractType | undefined => {
  if (contractType === 'INSURANCE_CONTRACT') {
    return 'INSURANCE';
  }
  if (contractType === 'GENERAL_CONTRACT') {
    return 'GENERAL';
  }
  return undefined;
};

/** BillingItem을 PrepaymentItemType으로 변환 */
const mapBillingToPrepaymentItem = (
  billing: DispatchBillingItem,
  status: 'waiting' | 'current' | 'past',
): PrepaymentItemType => {
  const durationStr = formatDuration(
    billing.daysElapsed,
    billing.hoursElapsed,
    billing.minutesElapsed,
  );

  return {
    id: billing.billingId,
    carName: billing.carModel,
    carNumber: billing.carNumber,
    company: billing.requestCompany,
    duration: durationStr,
    status,
    contractId: billing.contractId,
    contractType: convertContractType(billing.contractType),
  };
};

export default function PrepaymentScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<'waiting' | 'current' | 'past'>(
    'waiting',
  );
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBillingId, setSelectedBillingId] = useState<number | null>(
    null,
  );

  const confirmBillingMutation = useConfirmBilling();
  const cancelBillingRequestMutation = useCancelBillingRequest();

  // 현재 날짜의 년도와 월
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const currentMonth = useMemo(() => new Date().getMonth() + 1, []);

  // API hook (지급대기 탭일 때만 호출)
  const {
    data: pendingBillingsData,
    isLoading: isLoadingPending,
    error: pendingError,
  } = usePendingBillings();

  // API hook (당월배차내역 탭일 때만 호출)
  const {
    data: monthlyDispatchBillingsData,
    isLoading: isLoadingMonthly,
    error: monthlyError,
  } = useMonthlyDispatchBillings({ year: currentYear, month: currentMonth });

  // API hook (지난배차내역 탭일 때만 호출)
  const {
    data: previousDispatchBillingsData,
    isLoading: isLoadingPrevious,
    error: previousError,
  } = usePreviousDispatchBillings({ year: currentYear, month: currentMonth });

  /** API 데이터를 컴포넌트 구조로 변환 (지급대기) */
  const waitingData: PrepaymentItemType[] = useMemo(() => {
    if (!pendingBillingsData?.billings) return [];
    return pendingBillingsData.billings.map(billing =>
      mapBillingToPrepaymentItem(billing, 'waiting'),
    );
  }, [pendingBillingsData]);

  /** API 데이터를 컴포넌트 구조로 변환 (당월배차내역) */
  const currentData: PrepaymentItemType[] = useMemo(() => {
    if (!monthlyDispatchBillingsData?.billings) return [];
    return monthlyDispatchBillingsData.billings.map(billing =>
      mapBillingToPrepaymentItem(billing, 'current'),
    );
  }, [monthlyDispatchBillingsData]);

  /** API 데이터를 컴포넌트 구조로 변환 (지난배차내역) */
  const pastData: PrepaymentItemType[] = useMemo(() => {
    if (!previousDispatchBillingsData?.billings) return [];
    return previousDispatchBillingsData.billings.map(billing =>
      mapBillingToPrepaymentItem(billing, 'past'),
    );
  }, [previousDispatchBillingsData]);

  /** 탭별 데이터 */
  const data = useMemo(() => {
    if (activeTab === 'waiting') {
      return waitingData;
    }
    if (activeTab === 'current') {
      return currentData;
    }
    return pastData;
  }, [activeTab, waitingData, currentData, pastData]);

  /** 지급대기 건수 */
  const pendingCount = useMemo(() => {
    return pendingBillingsData?.pendingCount ?? 0;
  }, [pendingBillingsData]);

  /** 당월배차내역 건수 */
  const currentCount = useMemo(() => {
    return monthlyDispatchBillingsData?.totalCount ?? 0;
  }, [monthlyDispatchBillingsData]);

  /** 지난배차내역 건수 */
  const pastCount = useMemo(() => {
    return previousDispatchBillingsData?.totalCount ?? 0;
  }, [previousDispatchBillingsData]);

  const handleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderRowLayout = (
    isHeader = false,
    item?: PrepaymentItemType,
    expanded?: boolean,
  ) => (
    <View style={s.rowLayout}>
      <View style={{ flex: 66, alignItems: 'center' }}>
        <Text style={isHeader ? s.headerText : s.cellText}>
          {isHeader ? '차량명' : item?.carName}
        </Text>
      </View>
      <View style={{ flex: 74, alignItems: 'center' }}>
        <Text style={isHeader ? s.headerText : s.cellText}>
          {isHeader ? '번호' : item?.carNumber}
        </Text>
      </View>
      <View style={{ flex: 60, alignItems: 'center' }}>
        <Text style={isHeader ? s.headerText : s.cellText}>
          {isHeader ? '요청업체' : item?.company}
        </Text>
      </View>
      <View style={{ flex: 58, alignItems: 'center' }}>
        <Text
          style={[
            isHeader ? s.headerText : s.cellText,
            !isHeader && { color: colors.GRAY_50 },
          ]}
        >
          {isHeader ? '경과기간' : item?.duration}
        </Text>
      </View>

      <View
        style={{ width: 30, alignItems: 'center', justifyContent: 'center' }}
      >
        {isHeader ? (
          <View />
        ) : (
          <View style={s.arrowWrap}>
            <Image
              source={require('../../../assets/common/down_arrow.png')}
              style={[
                s.arrowIcon,
                { transform: [{ rotate: expanded ? '180deg' : '0deg' }] },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: PrepaymentItemType }) => {
    const isOpen = !!expanded[item.id];
    return (
      <Pressable onPress={() => handleExpand(item.id)} style={s.item}>
        <View style={s.statusBar} />
        <View style={s.itemBody}>
          {renderRowLayout(false, item, isOpen)}

          {isOpen && (
            <View style={s.buttonRow}>
              <Pressable
                style={[s.actionBtn, { backgroundColor: colors.GRAY_80 }]}
                onPress={() => {
                  if (item.contractId && item.contractType) {
                    navigation.navigate('ContractIntegrated', {
                      contractId: item.contractId,
                      contractType: item.contractType,
                    });
                  }
                }}
              >
                <Text style={s.actionText}>계약서 확인</Text>
              </Pressable>
              {item.status === 'waiting' && (
                <Pressable
                  style={[s.actionBtn, { backgroundColor: colors.PRIMARY_50 }]}
                  onPress={() => {
                    setSelectedBillingId(item.id);
                    setConfirmModalVisible(true);
                  }}
                >
                  <Text style={s.actionText}>지급확정</Text>
                </Pressable>
              )}
              <Pressable
                style={[s.actionBtn, { backgroundColor: colors.RED_50 }]}
                onPress={() => {
                  setSelectedBillingId(item.id);
                  setCancelModalVisible(true);
                }}
              >
                <Text style={s.actionText}>취소신청</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        canGoBack
        centerContent={<Text style={s.header}>사전지급 관리</Text>}
      />
      <View style={s.container}>
        {/* 상단 요약형 탭 */}
        <View style={s.summaryContainer}>
          {(
            [
              {
                key: 'waiting',
                label: '지급대기',
                value: pendingCount,
              },
              {
                key: 'current',
                label: '당월배차내역',
                value: currentCount,
              },
              {
                key: 'past',
                label: '지난배차내역',
                value: pastCount,
              },
            ] as const
          ).map((tab, idx) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[s.summaryCell, idx !== 2 && s.rightDivider]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={s.value}>{tab.value}</Text>
                <Text style={s.label}>{tab.label}</Text>
                {isActive && <View style={s.activeBorder} />}
              </Pressable>
            );
          })}
        </View>

        {/* 리스트 영역 */}
        <View style={s.listBox}>
          {renderRowLayout(true)}

          {(activeTab === 'waiting' && isLoadingPending) ||
          (activeTab === 'current' && isLoadingMonthly) ||
          (activeTab === 'past' && isLoadingPrevious) ? (
            <View style={s.loadingContainer}>
              <ActivityIndicator size="large" color={colors.PRIMARY_50} />
            </View>
          ) : (activeTab === 'waiting' && pendingError) ||
            (activeTab === 'current' && monthlyError) ||
            (activeTab === 'past' && previousError) ? (
            <View style={s.loadingContainer}>
              <Text style={s.errorText}>
                데이터를 불러오는 중 오류가 발생했습니다.
              </Text>
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
            />
          )}
        </View>
        <CommonModal
          visible={confirmModalVisible}
          title="지급확정"
          message="지급 확정할까요?"
          confirmText="지급확정"
          cancelText="취소"
          onCancel={() => {
            setConfirmModalVisible(false);
            setSelectedBillingId(null);
          }}
          onConfirm={() => {
            if (selectedBillingId !== null) {
              confirmBillingMutation.mutate(selectedBillingId, {
                onSuccess: () => {
                  setConfirmModalVisible(false);
                  setSelectedBillingId(null);
                },
                onError: () => {
                  Alert.alert('알림', '지급확정 처리에 실패했습니다.');
                },
              });
            }
          }}
        />

        <CommonModal
          visible={cancelModalVisible}
          title="취소신청"
          message="취소 신청할까요?"
          confirmText="취소신청"
          cancelText="취소"
          onCancel={() => {
            setCancelModalVisible(false);
            setSelectedBillingId(null);
          }}
          onConfirm={() => {
            if (selectedBillingId !== null) {
              cancelBillingRequestMutation.mutate(selectedBillingId, {
                onSuccess: () => {
                  setCancelModalVisible(false);
                  setSelectedBillingId(null);
                },
                onError: () => {
                  Alert.alert('알림', '취소 신청 처리에 실패했습니다.');
                },
              });
            }
          }}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.GRAY_00,
  },
  header: {
    fontSize: 20,
    color: colors.GRAY_90,
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
    paddingVertical: 14,
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
    borderColor: colors.PRIMARY_50,
    borderRadius: 4,
    zIndex: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.PRIMARY_50,
  },
  label: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_60,
  },
  listBox: {
    flex: 1,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
  },
  rowLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_60,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    backgroundColor: colors.WHITE,
  },
  statusBar: {
    width: 2,
    marginLeft: 4,
    marginVertical: 4,
    backgroundColor: colors.PRIMARY_50,
  },
  itemBody: {
    flex: 1,
    marginLeft: -6,
  },
  cellText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_60,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  arrowWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  actionBtn: {
    borderRadius: 4,
    padding: 12,
  },
  actionText: {
    color: colors.WHITE,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  errorText: {
    fontSize: 20,
    color: colors.GRAY_60,
    textAlign: 'center',
  },
});
