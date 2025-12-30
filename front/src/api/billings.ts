import axiosInstance from './axiosInstance';

/** 월별 통계 아이템 */
export interface MonthlyRevenueStatistic {
  month: string;
  dispatchCount: number;
  revenue: number;
}

/** 월별 통계 응답 */
export interface MonthlyRevenueResponse {
  statistics: MonthlyRevenueStatistic[];
  total: {
    dispatchCount: number;
    revenue: number;
  };
}

/** 매출 데이터 존재 연도 조회 */
export const fetchAvailableRevenueYears = async (): Promise<number[]> => {
  const res = await axiosInstance.get('/billings/v1/revenue/available-years');

  return res.data.data;
};

/** 월별 매출 통계 조회 */
export interface FetchMonthlyRevenueParams {
  year: number;
  partnerIds?: string[] | null; // null = 전체
}

export const fetchMonthlyRevenueStatistics = async (
  params: FetchMonthlyRevenueParams,
): Promise<MonthlyRevenueResponse> => {
  const res = await axiosInstance.get(
    '/billings/v1/revenue/monthly-statistics',
    {
      params,
    },
  );

  return res.data.data;
};
