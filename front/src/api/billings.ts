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

/** 공통 API Response */
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

/** 지급대기 청구 아이템 */
export interface DispatchBillingItem {
  billingId: number;
  carModel: string;
  carNumber: string;
  requestCompany: string;
  daysElapsed: number;
  hoursElapsed: number;
  minutesElapsed: number;
  contractId: number;
  contractType: 'INSURANCE_CONTRACT';
}

/** 지급대기 응답 */
export interface PendingBillingsResponse {
  pendingCount: number;
  billings: DispatchBillingItem[];
}

/** 지급대기 목록 조회 */
export const getPendingBillings =
  async (): Promise<PendingBillingsResponse> => {
    const res = await axiosInstance.get<ApiResponse<PendingBillingsResponse>>(
      '/billings/v1/app/pending',
    );

    return res.data.data;
  };

/** 당월배차내역 응답 */
export interface MonthlyDispatchBillingsResponse {
  totalCount: number;
  billings: DispatchBillingItem[];
}

/** 당월배차내역 목록 조회 */
export interface GetMonthlyDispatchBillingsParams {
  year: number;
  month: number;
}

export const getMonthlyDispatchBillings = async (
  params: GetMonthlyDispatchBillingsParams,
): Promise<MonthlyDispatchBillingsResponse> => {
  const res = await axiosInstance.get<
    ApiResponse<MonthlyDispatchBillingsResponse>
  >('/billings/v1/app/monthly-dispatch', { params });

  return res.data.data;
};

/** 지난배차내역 목록 조회 */
export const getPreviousDispatchBillings = async (
  params: GetMonthlyDispatchBillingsParams,
): Promise<MonthlyDispatchBillingsResponse> => {
  const res = await axiosInstance.get<
    ApiResponse<MonthlyDispatchBillingsResponse>
  >('/billings/v1/app/previous-dispatch', { params });

  return res.data.data;
};

/** 지급확정 */
export const confirmBilling = async (billingId: number): Promise<void> => {
  await axiosInstance.post<ApiResponse<{}>>(
    `/billings/v1/${billingId}/confirm`,
  );
};

/** 취소신청 */
export const cancelBillingRequest = async (
  billingId: number,
): Promise<void> => {
  await axiosInstance.post<ApiResponse<{}>>(
    `/billings/v1/${billingId}/cancel-request`,
  );
};
