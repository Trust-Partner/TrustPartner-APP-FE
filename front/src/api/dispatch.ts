import axiosInstance from './axiosInstance';

export type DispatchStatusRequest = 'REQUESTED' | 'CONFIRMED' | 'ALL';

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

/** 거래처 정보 */
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

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 배차 요청 목록 조회
export const getDispatchRequests = async (status: DispatchStatusRequest) => {
  return axiosInstance.get<ApiResponse<DispatchListResponse>>(
    '/api/cars/dispatch/request',
    { params: { dispatchStatusRequest: status } },
  );
};

// 거래처 상세 조회
export const getPartnerInfo = async (partnerId: string) => {
  return axiosInstance.get<ApiResponse<PartnerInfoResponse>>(
    `/api/partners/${partnerId}`,
  );
};

// 배차 요청 거부 (삭제)
export const rejectDispatchRequest = async (dispatchId: number) => {
  return axiosInstance.delete<ApiResponse<{}>>(
    `/api/cars/dispatch/${dispatchId}`,
  );
};
