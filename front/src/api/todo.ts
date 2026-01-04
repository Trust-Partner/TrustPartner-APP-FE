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

/** 반납신청 상세 조회 API Response */
export interface CarReturnRequest {
  carId: number;
  carModel: string;
  carNumber: string;
  returnTaskType: 'IMMEDIATELY' | 'BY_TODAY' | 'CALL_TO_CUSTOMER';
  requestedAt: string;
  timeAfterUpdate: string;
}

export interface ReturnDetailResponse {
  carReturnRequests: CarReturnRequest[];
}

/** 반납신청 상세 조회 */
export const getReturnDetail = async (
  locationId: number,
): Promise<ReturnDetailResponse> => {
  const res = await axiosInstance.get<ApiResponse<ReturnDetailResponse>>(
    `/tasks/v1/returns/${locationId}`,
  );

  return res.data.data;
};

/** 세차/주유 상세 조회 API Response */
export interface CarFuelWash {
  carId: number;
  carModel: string;
  carNumber: string;
  needsFuel: boolean;
  needsWash: boolean;
  requestedAt: string;
  timeAfterUpdate: string;
}

export interface FuelWashDetailResponse {
  carFuelWashes: CarFuelWash[];
}

/** 세차/주유 상세 조회 */
export const getFuelWashDetail = async (
  locationId: number,
): Promise<FuelWashDetailResponse> => {
  const res = await axiosInstance.get<ApiResponse<FuelWashDetailResponse>>(
    `/tasks/v1/fuel-wash/${locationId}`,
  );

  return res.data.data;
};

/** 주유완료 API Response */
export interface CompleteFuelResponse {
  carId: number;
  carModel: string;
  carNumber: string;
  needsFuel: boolean;
  needsWash: boolean;
  requestedAt: string;
  timeAfterUpdate: string;
}

/** 주유완료 */
export const completeFuel = async (
  carId: number,
): Promise<CompleteFuelResponse> => {
  const res = await axiosInstance.post<ApiResponse<CompleteFuelResponse>>(
    `/tasks/v1/fuel/${carId}`,
  );

  return res.data.data;
};

/** 세차완료 API Response (주유완료와 동일한 구조) */
export interface CompleteWashResponse {
  carId: number;
  carModel: string;
  carNumber: string;
  needsFuel: boolean;
  needsWash: boolean;
  requestedAt: string;
  timeAfterUpdate: string;
}

/** 세차완료 */
export const completeWash = async (
  carId: number,
): Promise<CompleteWashResponse> => {
  const res = await axiosInstance.post<ApiResponse<CompleteWashResponse>>(
    `/tasks/v1/wash/${carId}`,
  );

  return res.data.data;
};

