import axiosInstance from './axiosInstance';

/** 공통 API 응답 */
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

/* 1. 예약 통계 */
export interface ReservationStatics {
  todayCount: number;
  totalCount: number;
}

export const getReservationStatics = async (): Promise<ReservationStatics> => {
  const res = await axiosInstance.get<ApiResponse<ReservationStatics>>(
    '/cars/v1/reserve/statics',
  );
  return res.data.data;
};

/* 2. 캘린더 예약 조회 */
export type ReservationCalendarResponse = Record<string, number>;

export const getReservationCalendar = async (
  startDate: string,
  endDate: string,
): Promise<ReservationCalendarResponse> => {
  const res = await axiosInstance.get<ApiResponse<ReservationCalendarResponse>>(
    '/cars/v1/reserve/calendar',
    { params: { startDate, endDate } },
  );
  return res.data.data;
};

/* 3. 날짜별 예약 조회 */
export interface ReservationItem {
  reserveId: number;
  dispatchDateTime: string;
  reserverName: string;
  carModel: string;
  requestCompany: string | null;
  rentalType: string | null;
  dispatchLocation: string | null;
}

export interface ReservationByDateResponse {
  totalReserveCount: number;
  carReserves: ReservationItem[];
}

export const getReservationByDate = async (
  date: string,
): Promise<ReservationByDateResponse> => {
  const res = await axiosInstance.get<ApiResponse<ReservationByDateResponse>>(
    '/cars/v1/reserve/date',
    { params: { date } },
  );
  return res.data.data;
};
