import axiosInstance from './axiosInstance';

/** 공통 API Response */
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

/** 어드민 홈 실시간 상황판 응답 data */
export interface AdminHomeDashboard {
  rotationRate: number; // 회전율
  month: string;

  monthlyDispatchCount: number; // 해당월 배차건
  inUseCarCount: number; // 배차중 차량수
  availableCarCount: number; // 대기중 차량수

  returnRequestCarCount: number; // 반납신청
  dispatchRequestCount: number; // 배차요청건
  billingPendingCount: number; // 지급확정 대기

  RemainingReservationCount: number; // 예약관리
  washFuelLocationCount: number; // 세차/주유
}

export interface FetchAdminHomeParams {
  date: string; // YYYY-MM-DD
}

/** 어드민 홈 실시간 상황판 조회 */
export const getAdminHome = async (
  date: string,
): Promise<AdminHomeDashboard> => {
  const res = await axiosInstance.get<ApiResponse<AdminHomeDashboard>>(
    '/staffs/v1/home',
    { params: { date } },
  );

  return res.data.data;
};
