import axiosInstance from './axiosInstance';

// 차량 상태 타입
export type CarStatus = 'AVAILABLE' | 'IN_USE' | 'RETURN_REQUESTED';

/** 공통 API response 타입 */
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 전체 장소 요약
export interface CarStatusSummary {
  inUseNum: number;
  availableNum: number;
  returnRequestedNum: number;
  allNum: number;
}

export const getCarStatusSummary = async (): Promise<CarStatusSummary> => {
  const res = await axiosInstance.get<ApiResponse<CarStatusSummary>>(
    '/api/cars/status',
  );
  return res.data.data;
};

// 장소별 요약 리스트
export interface LocationStatusItem {
  locationId: number;
  locationName: string;
  all: number;
  available: number;
  inUse: number;
  returnRequested: number;
}

export const getCarStatusLocation = async (
  carNum?: string,
): Promise<LocationStatusItem[]> => {
  const res = await axiosInstance.get<
    ApiResponse<{ locations: LocationStatusItem[] }>
  >('/api/cars/status/location', {
    params: { carNum },
  });

  return res.data.data.locations;
};

// 특정 장소 상태 요약
export interface CarStatusByLocation {
  locationId: number;
  locationName: string;
  all: number;
  available: number;
  inUse: number;
  returnRequested: number;
}

export const getCarStatusByLocation = async (
  locationId: number,
): Promise<CarStatusByLocation> => {
  const res = await axiosInstance.get<ApiResponse<CarStatusByLocation>>(
    `/api/cars/status/location/${locationId}`,
  );
  return res.data.data;
};

// 특정 장소 차량 목록
export interface CarItem {
  carModel: string;
  carNum: string;
  updatedAt: string;
  timeAfterUpdate: string;
}

export interface CarsByLocationItem {
  locationId: number;
  locationName: string;
  carStatus: CarStatus;
  carListByLocation: CarItem[];
}

export const getCarsByLocation = async (
  locationId: number,
  carNum?: string,
): Promise<CarsByLocationItem[]> => {
  const res = await axiosInstance.get<ApiResponse<CarsByLocationItem[]>>(
    `/api/cars/status/${locationId}/cars`,
    {
      params: { carNum },
    },
  );
  return res.data.data;
};
