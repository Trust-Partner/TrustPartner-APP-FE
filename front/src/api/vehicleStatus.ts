import axiosInstance from './axiosInstance';

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// ADMIN(Manager)

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

export type ContractType = 'GENERAL_CONTRACT' | 'INSURANCE_CONTRACT';

export interface DispatchCarApiItem {
  carId: number;
  model: string;
  year: number;
  carNum: string;
  locationName: string;
  needsWash: boolean;

  isLiked: boolean;
  isConfirmed: boolean;

  carDispatchId: number | null;
  draftingContract: boolean;
  contractType: ContractType | null;
  contractId: number | null;

  reservationName: string | null;

  fuelLevel: number | null;
  fuelType: FuelType;
}

export interface DispatchCarsByGradeResponse {
  gradeId: number;
  gradeName: string;
  count: number;
  cars: DispatchCarApiItem[];
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
/*                     Dispatch Actions (찜 / 예약 / 반납)                       */
/* -------------------------------------------------------------------------- */

// 찜 / 예약
export interface ReserveCarRequest {
  staffId: string;
  carId: number;
  isReserved: boolean;
  dispatchDateTime: string;

  reserveRequest?: {
    requestCompany: string;
    rentalType: string;
    dispatchLocation: string;
  };
}

export interface ReserveCarResponse {
  staffId: string;
  carId: number;
  isReserved: boolean;
  reserveId?: number;
}

export const reserveCar = async (
  payload: ReserveCarRequest,
): Promise<ReserveCarResponse> => {
  const res = await axiosInstance.post<ApiResponse<ReserveCarResponse>>(
    '/cars/v1/reserve',
    payload,
  );

  return res.data.data;
};

// 반납
export interface ReturnCarRequest {
  carId: number;
  locationId: number;
  needsWash: boolean;
  needsFuel: boolean;
}

export interface ReturnCarResponse {
  carId: number;
  carModel: string;
  carNum: string;
  locationName: string;
  needsWash: boolean;
  needsFuel: boolean;
}

export const returnCar = async (
  payload: ReturnCarRequest,
): Promise<ReturnCarResponse> => {
  const res = await axiosInstance.post<ApiResponse<ReturnCarResponse>>(
    '/cars/v1/dispatch/return',
    payload,
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
  carId: number;
  carModel: string;
  carNum: string;
  updatedAt: string;
  timeAfterUpdate: string;

  contractId?: number | null;
  contractType?: 'GENERAL_CONTRACT' | 'INSURANCE_CONTRACT' | null;
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

/* -------------------------------------------------------------------------- */
/*                     Status Actions ( 교체 / 회수 )                           */
/* -------------------------------------------------------------------------- */

export interface ReplaceOrRecallPayload {
  isReplacement: boolean; // true: 교체하기, false: 회수하기
  carId: number;
  locationId: number;
  partnerId: string;
  needsWash: boolean;
  needsFuel: boolean;
  fuelLevel: number;
  photoKeys: string[];
}

export interface ReplaceOrRecallResponse {
  staffId: string;
  carId: number;
  model: string;
  carNum: string;
  carGrade: string;
  fuelLevel: number;
  year: number;
  locationId: number;
  locationName: string;
  partnerId: string;
  partnerName: string;
  needsWash: boolean;
  needsFuel: boolean;
  imageUrls: string[];
}

/** 교체/회수 요청 완료 */
export const requestReplaceOrRecall = async (
  payload: ReplaceOrRecallPayload,
): Promise<ReplaceOrRecallResponse> => {
  const res = await axiosInstance.post<ApiResponse<ReplaceOrRecallResponse>>(
    '/cars/v1/status/replace-or-recall',
    payload,
  );
  return res.data.data;
};

/** 이미지 업로드용 URL & 키 목록 조회 */
export interface UploadUrlItem {
  uploadUrl: string;
  fileKey: string;
  expiresAt: string;
}

export const getReplaceOrRecallUploadUrls = async (
  carId: number,
): Promise<UploadUrlItem[]> => {
  const res = await axiosInstance.get<ApiResponse<UploadUrlItem[]>>(
    `/cars/v1/status/${carId}/replace-or-recall/upload-urls`,
  );
  return res.data.data;
};

/** S3 이미지 직접 업로드 */
export const uploadImageToS3 = async (
  url: string,
  fileUri: string,
): Promise<{ status: number; ok: boolean }> => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const uploadResponse = await fetch(url, {
      method: 'PUT',
      body: blob,
      headers: { 'Content-Type': 'image/jpeg' },
    });
    return { status: uploadResponse.status, ok: uploadResponse.ok };
  } catch (error) {
    // 운영 환경에서도 업로드 실패 원인은 파악해야 하므로 에러 로그만 유지
    console.error('[S3 Upload Error]:', error);
    return { status: 0, ok: false };
  }
};

// USER(Partner)

/** 차량 상태 */
export type PartnerCarStatus = 'AVAILABLE' | 'IN_USE' | 'RETURN_REQUESTED';

/** 상태별 차량 수 응답 */
export interface PartnerCarStatusSummary {
  inUseNum: number;
  waitingNum: number;
  returnRequestedNum: number;
  allNum: number;
}

/** 차량 리스트 아이템 */
export interface PartnerCarItem {
  carId: number;
  carStatus: PartnerCarStatus;
  model: string;
  carNum: string;
  updatedAt: string;
  timeAfterUpdate: string;
  immediateDispatchable: boolean;
  locationName: string;
  contractId?: number | null;
  contractType?: 'GENERAL_CONTRACT' | 'INSURANCE_CONTRACT' | null;
}

/** 차량 리스트 응답 */
export interface PartnerCarListResponse {
  carStatus: PartnerCarStatus | null;
  carList: PartnerCarItem[];
}

/** 거래처 상태별 차량 수 조회 */
export const getPartnerCarStatusSummary =
  async (): Promise<PartnerCarStatusSummary> => {
    const res = await axiosInstance.get<ApiResponse<PartnerCarStatusSummary>>(
      '/cars/v1/partners/status',
    );

    return res.data.data;
  };

/** 거래처 차량 리스트 조회 (status optional) */
export const getPartnerCars = async (
  carStatus?: PartnerCarStatus,
): Promise<PartnerCarListResponse> => {
  const res = await axiosInstance.get<ApiResponse<PartnerCarListResponse>>(
    '/cars/v1/partners',
    {
      params: carStatus ? { carStatus } : undefined,
    },
  );

  return res.data.data;
};

/** 거래처 반납신청 */
export interface RequestPartnerReturnRequest {
  locationAnswer: 'AT_PARTNER_LOCATION' | 'CALL_TO_CUSTOMER';
  whenToReturn: 'IMMEDIATELY' | 'BY_TODAY';
}

export interface RequestPartnerReturnResponse {
  carStatus: 'AVAILABLE' | 'IN_USE' | 'RETURN_REQUESTED';
  carId: number;
  model: string;
  carNum: string;
  updatedAt: string;
  timeAfterUpdate: string;
  immediateDispatchable: boolean;
  locationName: string;
}

export const requestPartnerReturn = async (
  carId: number,
  payload: RequestPartnerReturnRequest,
): Promise<RequestPartnerReturnResponse> => {
  const res = await axiosInstance.post<ApiResponse<RequestPartnerReturnResponse>>(
    `/cars/v1/partners/${carId}/return`,
    payload,
  );

  return res.data.data;
};
