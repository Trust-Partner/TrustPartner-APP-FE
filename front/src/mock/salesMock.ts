export interface SalesSummary {
  userName: string;
  currentGrade: number;
  payRates: Record<number, number>;
  prePaidAmount: number;
  settlementAmount: number;
  avgDays: number;
}

export const salesSummaryMock: SalesSummary = {
  userName: '서승동',
  currentGrade: 5,
  payRates: {
    1: 27,
    2: 25,
    3: 23,
    4: 22,
    5: 20,
  },
  prePaidAmount: 2840000,
  settlementAmount: 156000,
  avgDays: 3.7,
};

/** 이번달 배차 목록 */
export const dispatchListMock = {
  month: '2024-08',
  totalDispatches: 5,
  list: [
    { id: 1, title: '모닝', date: '2024-08-01', amount: 44324 },
    { id: 2, title: '모닝', date: '2024-08-01', amount: 44324 },
    { id: 3, title: '모닝', date: '2024-08-01', amount: 44324 },
    { id: 4, title: '모닝', date: '2024-08-01', amount: 44324 },
    { id: 5, title: '모닝', date: '2024-08-01', amount: 44324 },
  ],
};

// 총합 계산 (차량관리금액 + 정산금액)
export const getMonthlyTotal = (summary: typeof salesSummaryMock) =>
  summary.prePaidAmount + summary.settlementAmount;
