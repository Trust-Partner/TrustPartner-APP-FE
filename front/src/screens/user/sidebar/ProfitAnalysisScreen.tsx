import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors } from '../../../constants/colors';
import { adminMyInfoMock } from '../../../mock/adminMyInfoMock';
import ToastMessage from '../../../components/common/ToastMessage';
import AppHeader from '../../../components/common/AppHeader';
import { usePartnerMonthlyStatistics } from '../../../hooks/billings/usePartnerMonthlyStatistics';
import { useGeneralManagerInquiry } from '../../../hooks/inquiry/useGeneralManagerInquiry';
import { formatPhoneNumber } from '../../../utils/formatPhoneNumber';

export default function SalesAnalysisScreen() {
  const [tab, setTab] = useState<'sales' | 'count'>('sales');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [openYear, setOpenYear] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [selectedGrade, setSelectedGrade] =
    useState<keyof typeof data.carRatesByGrade>('1등급');
  const [open, setOpen] = useState(false);

  const data = adminMyInfoMock;
  const carRates = data.carRatesByGrade[selectedGrade];
  const yearOptions = [2025, 2024, 2023];

  // API 호출
  const {
    data: statistics,
    isLoading,
    isError,
  } = usePartnerMonthlyStatistics({ year: selectedYear });

  // API 데이터를 화면 형식에 맞게 변환
  const partnerStats = useMemo(() => {
    if (!statistics?.monthlyStatistics) return [];

    // 연도 뒷 두자리 추출 (예: 2025 -> '25')
    const yearShort = String(selectedYear).slice(-2);

    return statistics.monthlyStatistics.map(item => ({
      month: `${yearShort}.${String(item.month).padStart(2, '0')}`,
      sales: item.amount,
      count: item.dispatchCount,
    }));
  }, [statistics, selectedYear]);

  // 총합 계산
  const totalSales = useMemo(() => {
    return statistics?.totalAmount ?? 0;
  }, [statistics]);

  const totalCount = useMemo(() => {
    return statistics?.totalDispatchCount ?? 0;
  }, [statistics]);

  const {
    data: manager,
    isLoading: isManagerLoading,
    isError: isManagerError,
  } = useGeneralManagerInquiry();

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    setToastMsg('전화번호가 복사되었습니다.');
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        canGoBack
        centerContent={<Text style={s.header}>수익 분석</Text>}
      />

      <ScrollView bounces={false} alwaysBounceVertical={false}>
        <View style={s.container}>
          {/* 월별 통계 */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.cardTitleBox}>
                <Image
                  source={require('../../../assets/admin-partner/chart.png')}
                  style={s.icon}
                />
                <Text style={s.cardTitle}>월별 통계</Text>
              </View>

              <View style={{ position: 'relative' }}>
                <Pressable
                  style={s.selectBox}
                  onPress={() => setOpenYear(!openYear)}
                >
                  <Text style={s.selectText}>{selectedYear}</Text>
                  <Image
                    source={require('../../../assets/common/down_arrow.png')}
                    style={s.arrow}
                  />
                </Pressable>

                {openYear && (
                  <View style={[s.dropdown, { top: 30, right: 0, width: 80 }]}>
                    {yearOptions.map(y => (
                      <Pressable
                        key={y}
                        style={[
                          s.dropdownItem,
                          y === selectedYear && s.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setSelectedYear(y);
                          setOpenYear(false);
                        }}
                      >
                        <Text
                          style={[
                            s.dropdownText,
                            y === selectedYear && s.dropdownTextActive,
                          ]}
                        >
                          {y}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={s.tabRow}>
              <Text style={s.unitLabel}>월</Text>
              <View style={s.tabGroup}>
                <Pressable
                  style={[s.tab, tab === 'count' && s.tabActive]}
                  onPress={() => setTab('count')}
                >
                  <Text style={[s.tabText, tab === 'count' && s.tabTextActive]}>
                    건수
                  </Text>
                </Pressable>
                <Pressable
                  style={[s.tab, tab === 'sales' && s.tabActive]}
                  onPress={() => setTab('sales')}
                >
                  <Text style={[s.tabText, tab === 'sales' && s.tabTextActive]}>
                    매출
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={s.topDivider} />

            {isLoading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.PRIMARY_50} />
              </View>
            ) : isError || !statistics ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: colors.RED_50, fontSize: 18 }}>
                  데이터를 불러올 수 없습니다.
                </Text>
              </View>
            ) : partnerStats.length > 0 ? (
              <>
                {partnerStats.map((item, idx) => (
                  <View
                    key={idx}
                    style={[
                      s.row,
                      idx === partnerStats.length - 1 && {
                        borderBottomWidth: 0,
                      },
                    ]}
                  >
                    <Text style={s.cell}>{item.month}</Text>
                    <Text style={s.cell}>
                      {tab === 'sales'
                        ? `₩ ${item.sales.toLocaleString('ko-KR')}`
                        : `${item.count}건`}
                    </Text>
                  </View>
                ))}

                <View style={[s.totalRow, s.footer]}>
                  <Text style={[s.cell, s.boldMonth]}>합계</Text>
                  <Text style={[s.cell, s.boldCell]}>
                    {tab === 'sales'
                      ? `₩ ${totalSales.toLocaleString('ko-KR')}`
                      : `${totalCount}건`}
                  </Text>
                </View>
              </>
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: colors.GRAY_50, fontSize: 18 }}>
                  데이터가 없습니다.
                </Text>
              </View>
            )}
          </View>

          {/* 등급별 지급비율표 */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.cardTitleBox}>
                <Image
                  source={require('../../../assets/admin-myinfo/chart.png')}
                  style={s.icon}
                />
                <Text style={s.cardTitle}>등급별 지급비율표</Text>
              </View>
            </View>

            {data.gradeRates.map((g, i) => (
              <View key={i} style={s.rateCard}>
                <View>
                  <Text style={s.gradeLabel}>{g.grade}</Text>
                  <Text style={s.gradeSub}>{g.name}</Text>
                </View>

                <View style={s.rateCardRight}>
                  <Text style={s.rateText}>{g.rate}</Text>
                  <Text style={s.rateDesc}>지급비율</Text>
                </View>
              </View>
            ))}
          </View>

          {/* 차량관리 금액표 */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.cardTitleBox}>
                <Image
                  source={require('../../../assets/admin-myinfo/money.png')}
                  style={s.icon}
                />
                <Text style={s.cardTitle}>차량관리 금액표</Text>
              </View>

              <View style={{ position: 'relative' }}>
                <Pressable style={s.selectBox} onPress={() => setOpen(!open)}>
                  <Text style={s.selectText}>{selectedGrade}</Text>
                  <Image
                    source={require('../../../assets/common/down_arrow.png')}
                    style={s.arrow}
                  />
                </Pressable>

                {open && (
                  <View style={s.dropdown}>
                    {Object.keys(data.carRatesByGrade).map(grade => (
                      <Pressable
                        key={grade}
                        style={[
                          s.dropdownItem,
                          grade === selectedGrade && s.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setSelectedGrade(
                            grade as keyof typeof data.carRatesByGrade,
                          );
                          setOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            s.dropdownText,
                            grade === selectedGrade && s.dropdownTextActive,
                          ]}
                        >
                          {grade}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {carRates.map((item, i) => (
              <View key={i} style={s.tableRow}>
                <Text style={s.tableLeft}>{item.type}</Text>
                <Text style={s.tableRight}>{item.amount}</Text>
              </View>
            ))}
          </View>

          {/* 매출관리 기준 문의 */}
          <View style={s.inquiryCard}>
            <View style={s.inquiryTop}>
              <Image
                source={require('../../../assets/common/speech.png')}
                style={s.inquiryIcon}
              />
              <Text style={s.inquiryTitle}>매출관리 기준 문의</Text>
            </View>
            <Text style={s.inquiryText}>
              등급별 비율 조정이나 렌트차량 금액에 대한 문의사항은 매니저에게
              문의해주세요.
            </Text>

            <Pressable
              style={s.contactBtn}
              onPress={() => {
                if (manager?.phoneNumber) {
                  handleCopy(manager.phoneNumber);
                }
              }}
              disabled={!manager}
            >
              <Image
                source={require('../../../assets/common/copy.png')}
                style={{
                  width: 12,
                  height: 12,
                  tintColor: colors.WHITE,
                  marginRight: 4,
                }}
              />
              <Text style={s.contactText}>
                {manager
                  ? `${manager.staffName} ${
                      manager.title
                    } | ${formatPhoneNumber(manager.phoneNumber)}`
                  : '담당자 정보를 불러오는 중입니다'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {toastMsg ? (
        <ToastMessage message={toastMsg} onHide={() => setToastMsg('')} />
      ) : null}
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
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.GRAY_80,
    lineHeight: 28,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.GRAY_05,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_60,
    marginRight: 4,
  },
  arrow: {
    width: 12,
    height: 12,
    tintColor: colors.GRAY_50,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    elevation: 3,
    zIndex: 99,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  dropdownItemActive: { backgroundColor: colors.GRAY_05 },
  dropdownText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_60,
  },
  dropdownTextActive: { color: colors.PRIMARY_50 },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  tabGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
    marginLeft: 6,
    backgroundColor: colors.GRAY_10,
  },
  tabActive: { backgroundColor: colors.PRIMARY_10 },
  tabText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_40,
    lineHeight: 25,
  },
  tabTextActive: { color: colors.PRIMARY_50 },
  unitLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_80,
  },
  topDivider: {
    height: 1,
    backgroundColor: colors.GRAY_15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.GRAY_15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: colors.GRAY_40,
    marginTop: 2,
    paddingTop: 8,
  },
  cell: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_70,
  },
  boldMonth: {
    fontWeight: '600',
    color: colors.GRAY_80,
  },
  boldCell: {
    fontSize: 20,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_15,
  },
  tableLeft: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_70,
    lineHeight: 25,
  },
  tableRight: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_70,
    lineHeight: 25,
  },
  rateCard: {
    backgroundColor: colors.GRAY_05,
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.GRAY_10,
  },
  rateCardRight: {
    alignItems: 'flex-end',
  },
  gradeLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.GRAY_80,
  },
  gradeSub: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_50,
    marginTop: 4,
  },
  rateText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.PRIMARY_50,
  },
  rateDesc: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_50,
    marginTop: 4,
  },
  inquiryCard: {
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.PRIMARY_20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    // marginBottom: 16,
  },
  inquiryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inquiryIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  inquiryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.GRAY_80,
    lineHeight: 28,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  inquiryText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_70,
    marginBottom: 8,
  },
  contactBtn: {
    backgroundColor: colors.PRIMARY_50,
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contactText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.WHITE,
    lineHeight: 28,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
});
