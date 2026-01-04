import axiosInstance from './axiosInstance';

/** 공통 API Response */
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

/** 반납신청 API Response */
export interface ReturnLocation {
  unprocessedPreviousDay: boolean;
  locationId: number;
  locationName: string;
  carAtLocationCount: number;
  immediateReturnRequestCount: number;
  byTodayReturnRequestCount: number;
  callToCustomerRequestCount: number;
}

export interface ReturnRequestResponse {
  totalReturnRequestCount: number;
  locations: ReturnLocation[];
}

/** 세차/주유 API Response */
export interface FuelWashLocation {
  unprocessedPreviousDay: boolean;
  locationId: number;
  locationName: string;
  carAtLocationCount: number;
  needsFuelCount: number;
  needsWashCount: number;
}

export interface FuelWashResponse {
  totalFuelWashCount: number;
  locations: FuelWashLocation[];
}

/** 반납신청 목록 조회 */
export const getReturnRequests = async (): Promise<ReturnRequestResponse> => {
  const res = await axiosInstance.get<ApiResponse<ReturnRequestResponse>>(
    '/tasks/v1/returns',
  );

  return res.data.data;
};

/** 세차/주유 목록 조회 */
export const getFuelWashRequests = async (): Promise<FuelWashResponse> => {
  const res = await axiosInstance.get<ApiResponse<FuelWashResponse>>(
    '/tasks/v1/fuel-wash',
  );

  return res.data.data;
};

