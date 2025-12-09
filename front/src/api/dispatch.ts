import axiosInstance from './axiosInstance';

export type DispatchStatusRequest = 'REQUESTED' | 'CONFIRMED' | 'ALL';

/** 개별 배차 요청 Item */
export interface DispatchItem {
  dispatchId: number;
  partnerId: string;
  partnerName: string;
  carModel: string;
  carYearGroup: string;
  displacementGroup: string;
  dispatchStatus: string;
  dispatchDateTime: string;
}

/** 배차 요청 목록 응답 */
export interface DispatchListResponse {
  totalDispatchCount: number;
  dispatchList: DispatchItem[];
}

/** 거래처 상세 조회 응답 */
export interface PartnerInfoResponse {
  partnerId: string;
  partnerName: string;
  phoneNumber: string;
  address: string;
  loginId: string;
  branch: string;
  partnerRole: {
    code: string;
    description: string;
  };
  teamLeaderInfo: {
    staffId: string;
    staffName: string;
    staffRole: {
      code: string;
      description: string;
    };
  };
}

/** 공통 API response 타입 */
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

/* 배차 요청 목록 조회 */
export const getDispatchRequests = async (
  status: DispatchStatusRequest,
): Promise<DispatchListResponse> => {
  const res = await axiosInstance.get<ApiResponse<DispatchListResponse>>(
    '/api/cars/dispatch/request',
    { params: { dispatchStatusRequest: status } },
  );

  return res.data.data;
};

/* 거래처 상세 조회 */
export const getPartnerInfo = async (
  partnerId: string,
): Promise<PartnerInfoResponse> => {
  const res = await axiosInstance.get<ApiResponse<PartnerInfoResponse>>(
    `/api/partners/${partnerId}`,
  );

  return res.data.data;
};

/* 배차 요청 거부 */
export const rejectDispatchRequest = async (
  dispatchId: number,
): Promise<{}> => {
  const res = await axiosInstance.delete<ApiResponse<{}>>(
    `/api/cars/dispatch/${dispatchId}`,
  );

  return res.data.data;
};
