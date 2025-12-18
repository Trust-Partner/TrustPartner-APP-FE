import axiosInstance from './axiosInstance';

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

/* -------------------------------------------------------------------------- */
/*                               Dispatch (배차)                              */
/* -------------------------------------------------------------------------- */

export type DispatchCarType = 'DOMESTIC_SEDAN' | 'DOMESTIC_SUV' | 'IMPORTED';

/** 차급 요약 */
export interface DispatchCarGrade {
  gradeId: number;
  gradeName: string;
  totalCount: number;
  availableCount: number;
  likedOrConfirmedCount: number;
}

export interface DispatchCarGradeResponse {
  carType: DispatchCarType;
  grades: DispatchCarGrade[];
}

export const getDispatchCarGrades = async (
  carType: DispatchCarType,
): Promise<DispatchCarGradeResponse> => {
  const res = await axiosInstance.get<ApiResponse<DispatchCarGradeResponse>>(
    '/cars/v1/carGrade',
    { params: { carType } },
  );

  return res.data.data;
};

export type FuelType = 'GASOLINE' | 'DIESEL' | 'ELECTRIC';

/** 차급별 차량 */
export interface DispatchCarItem {
  carId: number;
  model: string;
  year: number;
  carNum: string;
  locationName: string;
  needsWash: boolean;
  likedOrConfirmed: boolean;
  reservationName: string | null;
  fuelLevel: number | null;
  fuelType: FuelType;
}

export interface DispatchCarsByGradeResponse {
  gradeId: number;
  gradeName: string;
  count: number;
  cars: DispatchCarItem[];
}

export const getDispatchCarsByGrade = async (
  gradeId: number,
): Promise<DispatchCarsByGradeResponse> => {
  const res = await axiosInstance.get<ApiResponse<DispatchCarsByGradeResponse>>(
    `/cars/v1/grade/${gradeId}`,
  );

  return res.data.data;
};

/* -------------------------------------------------------------------------- */
/*                           Vehicle Status (현황)                            */
/* -------------------------------------------------------------------------- */

export type CarStatus = 'AVAILABLE' | 'IN_USE' | 'RETURN_REQUESTED';

/** 전체 요약 */
export interface CarStatusSummary {
  inUseNum: number;
  availableNum: number;
  returnRequestedNum: number;
  allNum: number;
}

export const getCarStatusSummary = async (): Promise<CarStatusSummary> => {
  const res = await axiosInstance.get<ApiResponse<CarStatusSummary>>(
    '/cars/v1/status',
  );
  return res.data.data;
};

/** 장소별 요약 */
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
  >('/cars/v1/status/location', {
    params: { carNum },
  });

  return res.data.data.locations;
};

/** 특정 장소 요약 */
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
    `/cars/v1/status/location/${locationId}`,
  );
  return res.data.data;
};

/** 특정 장소 차량 목록 */
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
    `/cars/v1/status/${locationId}/cars`,
    { params: { carNum } },
  );
  return res.data.data;
};
