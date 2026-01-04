import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../constants/colors';
import {
  salesSummaryMock,
  dispatchListMock,
  getMonthlyTotal,
} from '../../../mock/salesMock';
import { usePartnerCurrentMonthStatistics } from '../../../hooks/billings/usePartnerCurrentMonthStatistics';

const SalesManageScreen = () => {
  const dispatch = dispatchListMock;

  // 현재 날짜 기준 년, 월 가져오기
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth()는 0-11이므로 +1

  // API 호출
  const {
    data: statistics,
    isLoading,
    isError,
  } = usePartnerCurrentMonthStatistics({
    year: currentYear,
    month: currentMonth,
  });

  // 등급 이름에서 숫자 추출 (예: "1등급" -> 1, "5등급" -> 5)
  const currentGrade = useMemo(() => {
    if (!statistics?.gradeName) return salesSummaryMock.currentGrade;
    const match = statistics.gradeName.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : salesSummaryMock.currentGrade;
  }, [statistics?.gradeName]);

  // payRate는 discountRate를 그대로 사용 (discountRate가 지급율인 것으로 가정)
  // 만약 discountRate가 할인율이라면 100 - discountRate를 사용해야 함
  const payRate =
    statistics?.discountRate ?? salesSummaryMock.payRates[currentGrade];

  // 이번달 총 매출
  const currentMonthTotal =
    statistics?.totalAmount ?? getMonthlyTotal(salesSummaryMock);

  // 사전 지급 금액 (차량관리 금액)
  const prePaidAmount =
    statistics?.carManagementAmount ?? salesSummaryMock.prePaidAmount;

  // 정산 금액
  const settlementAmount =
    statistics?.settlementAmount ?? salesSummaryMock.settlementAmount;

  // 기존 payRates (등급 비교 계산용 - 현재는 mock 데이터 사용)
  // 실제로는 모든 등급의 discountRate를 가져와야 하지만, 현재 API는 현재 등급만 제공
  const payRates = salesSummaryMock.payRates;

  // 선택된 등급 (null = 선택안함)
  const [selectedGrade, setSelectedGrade] = useState<number>(currentGrade);

  // 버튼 배열 (현재 등급 위치에 "현재" 삽입)
  const gradeButtons = useMemo(() => {
    const arr = [1, 2, 3, 4, 5];
    return arr.map(num => (num === currentGrade ? '현재' : num));
  }, [currentGrade]);

  // 계산된 비교 데이터
  const calculated = useMemo(() => {
    const baseYearTotal = currentMonthTotal * 12;
    const targetGrade =
      selectedGrade && selectedGrade >= 1 && selectedGrade <= 5
        ? selectedGrade
        : currentGrade;
    const targetRate = payRates[targetGrade];

    const appliedMonthly = (currentMonthTotal / payRate) * targetRate;
    const appliedYearly = (baseYearTotal / payRate) * targetRate;
    const monthlyGain = appliedMonthly - currentMonthTotal;
    const yearlyGain = monthlyGain * 12;

    return {
      targetGrade,
      targetRate,
      appliedMonthly,
      appliedYearly,
      monthlyGain,
      yearlyGain,
    };
  }, [selectedGrade, currentMonthTotal, payRate, currentGrade, payRates]);

  if (isLoading) {
    return (
      <View
        style={[
          s.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="small" color={colors.PRIMARY_50} />
      </View>
    );
  }

  if (isError || !statistics) {
    return (
      <View
        style={[
          s.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: colors.RED_50 }}>
          데이터를 불러올 수 없습니다.
        </Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        {/* 이번달 총합계 */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.headerRow}>
              <Image
                source={require('../../../assets/common/money.png')}
                style={s.smallIcon}
              />
              <Text style={s.sectionTitle}>이번달 총 합계</Text>
            </View>
            <View style={s.gradeTagBox}>
              <Text style={s.tag}>{currentGrade}등급</Text>
              <Text style={s.tag}>{payRate}% 지급</Text>
            </View>
          </View>

          <View style={s.totalBox}>
            <Text style={s.totalAmount}>
              ₩ {currentMonthTotal.toLocaleString()}
            </Text>
            <Text style={s.totalSub}>차량관리 금액 + 정산 금액</Text>
          </View>
        </View>

        <View style={s.cardRow}>
          <View style={s.card}>
            <Text style={s.cardAmount}>₩ {prePaidAmount.toLocaleString()}</Text>
            <Text style={s.cardLabel}>사전 지급 금액</Text>
            <Text style={s.cardSub}>차량관리 금액</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardAmount}>
              ₩ {settlementAmount.toLocaleString()}
            </Text>
            <Text style={s.cardLabel}>이번달 정산금액</Text>
            <Text style={s.cardSub}>실제 렌트비 차액</Text>
          </View>
        </View>

        {/* 등급 비교 */}
        <View style={s.section}>
          <View style={s.gradeRow}>
            {gradeButtons.map((label, i) => {
              const gradeNum = typeof label === 'number' ? label : currentGrade;
              const isActive = selectedGrade === gradeNum;
              const displayText =
                isActive && label !== '현재' ? `${label}등급` : String(label);

              return (
                <Pressable
                  key={i}
                  onPress={() => setSelectedGrade(gradeNum)}
                  style={[
                    s.gradeButton,
                    isActive && {
                      backgroundColor: colors.PRIMARY_50,
                      borderWidth: 0,
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.gradeText,
                      isActive && {
                        color: colors.WHITE,
                      },
                    ]}
                  >
                    {displayText}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View
            style={[
              s.infoBox,
              {
                backgroundColor: colors.YELLOW_00,
                borderColor: colors.YELLOW_10,
              },
            ]}
          >
            <View>
              <Text style={[s.infoLabel, { color: colors.YELLOW_50 }]}>
                {calculated.targetGrade}등급 적용 시 연 총액
              </Text>
              <Text style={s.infoSub}>
                {calculated.targetRate}% 지급비율 적용
              </Text>
            </View>

            <Text style={[s.infoValue, { color: colors.YELLOW_50 }]}>
              ₩ {Math.round(calculated.appliedYearly).toLocaleString()}
            </Text>
          </View>

          <View
            style={[
              s.infoBox,
              {
                backgroundColor: colors.PRIMARY_10,
                borderColor: colors.PRIMARY_15,
              },
            ]}
          >
            <View>
              <Text style={s.infoLabel}>
                {calculated.targetGrade}등급 적용 시 월 총액
              </Text>
              <Text style={s.infoSub}>
                {calculated.targetRate}% 지급비율 적용
              </Text>
            </View>
            <Text style={s.infoValue}>
              ₩ {Math.round(calculated.appliedMonthly).toLocaleString()}
            </Text>
          </View>

          <View
            style={[
              s.infoBox,
              {
                backgroundColor: colors.PRIMARY_00,
                borderColor: colors.PRIMARY_10,
              },
            ]}
          >
            <View>
              <Text style={s.infoLabel}>현재대비 월간 추가수익</Text>
              <Text style={s.infoSub}>
                {calculated.targetGrade}등급 vs 현재 {currentGrade}등급
              </Text>
            </View>
            <Text style={s.infoValue}>
              +₩ {Math.round(calculated.monthlyGain).toLocaleString()}
            </Text>
          </View>

          <View
            style={[
              s.infoBox,
              {
                backgroundColor: colors.WHITE,
                borderColor: colors.PRIMARY_10,
                marginBottom: 0,
              },
            ]}
          >
            <View>
              <Text style={s.infoLabel}>현재대비 연간 추가수익</Text>
              <Text style={s.infoSub}>월간 추가수익 * 12개월</Text>
            </View>
            <Text style={s.infoValue}>
              +₩ {Math.round(calculated.yearlyGain).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* 이번달 배차 목록 */}
        <View style={[s.section, { marginBottom: 0 }]}>
          <View style={[s.sectionHeader, { justifyContent: 'flex-start' }]}>
            <Image
              source={require('../../../assets/common/car.png')}
              style={s.smallIcon}
            />
            <Text style={s.sectionTitle}>8월 배차 목록</Text>
          </View>

          <View>
            <ScrollView
              style={{ maxHeight: 200 }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {dispatch.list.map(item => (
                <View key={item.id} style={s.dispatchItem}>
                  <View>
                    <Text style={s.dispatchTitle}>{item.title}</Text>
                    <Text style={s.dispatchDate}>{item.date}</Text>
                  </View>
                  <Text style={s.dispatchAmount}>
                    ₩{item.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={s.divider} />

            <View style={s.dispatchFooter}>
              <Text style={s.footerText}>
                총 {dispatch.totalDispatches}건 배차
              </Text>
              <Text style={s.footerAmount}>
                ₩
                {dispatch.list
                  .reduce((acc, cur) => acc + cur.amount, 0)
                  .toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SalesManageScreen;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
  },
  scroll: {
    padding: 16,
  },
  section: {
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallIcon: {
    width: 16,
    height: 16,
    tintColor: colors.GRAY_80,
    marginRight: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_80,
    lineHeight: 16.8,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  gradeTagBox: {
    flexDirection: 'row',
    gap: 4,
  },
  tag: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.PRIMARY_50,
    lineHeight: 15.4,
    backgroundColor: colors.PRIMARY_05,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  totalBox: {
    borderWidth: 1,
    borderColor: colors.PRIMARY_20,
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 4,
    paddingVertical: 8,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.PRIMARY_50,
    textAlign: 'center',
  },
  totalSub: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    textAlign: 'center',
    marginTop: 4,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingVertical: 8,
  },
  cardAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.PRIMARY_50,
    textAlign: 'center',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.GRAY_50,
    textAlign: 'center',
    marginTop: 4,
  },
  cardSub: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    textAlign: 'center',
    marginTop: 4,
  },
  gradeRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  gradeButton: {
    backgroundColor: colors.PRIMARY_10,
    borderWidth: 1,
    borderColor: colors.PRIMARY_05,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gradeText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.PRIMARY_50,
    lineHeight: 15.4,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: colors.GRAY_05,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.PRIMARY_80,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.PRIMARY_80,
  },
  infoSub: {
    fontSize: 11,
    color: colors.GRAY_50,
    marginTop: 4,
  },
  dispatchItem: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dispatchTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_80,
  },
  dispatchDate: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    marginTop: 4,
  },
  dispatchAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.PRIMARY_50,
  },
  divider: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    marginVertical: 8,
  },
  dispatchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_80,
  },
  footerAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.PRIMARY_50,
  },
});
