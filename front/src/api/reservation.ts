import axiosInstance from './axiosInstance';

/** 공통 API 응답 */
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

/* 예약 통계 */
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

/* 캘린더 예약 조회 */
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

/* 날짜별 예약 조회 */
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

/** 예약 수정 */
export interface UpdateReservationPayload {
  requestCompany: string;
  rentalType: string;
  dispatchLocation: string;
}

export const updateReservation = async (
  reserveId: number,
  payload: UpdateReservationPayload,
) => {
  const res = await axiosInstance.put<ApiResponse<any>>(
    `/cars/v1/reserve/${reserveId}`,
    payload,
  );
  return res.data.data;
};

/** 예약 삭제 */
export const deleteReservation = async (reserveId: number) => {
  const res = await axiosInstance.delete<ApiResponse<{}>>(
    `/cars/v1/reserve/${reserveId}`,
  );
  return res.data.data;
};
