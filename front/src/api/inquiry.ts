import axiosInstance from './axiosInstance';

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// Partner (담당팀장)
export interface PartnerInquiryResponse {
  phoneNumber: string; // 거래처 전화번호
  teamLeaderInfo: {
    staffName: string;
    staffRole: {
      code: string;
      description: string;
    };
  };
}

/** 담당팀장(거래처) 정보 조회 */
export const getPartnerInquiry = (partnerId: string) => {
  return axiosInstance.get<ApiResponse<PartnerInquiryResponse>>(
    `/partners/v1/${partnerId}`,
  );
};

// General Manager (지점장)
export interface GeneralManagerInquiryResponse {
  staffName: string;
  staffRole: {
    code: string;
    description: string;
  };
  phoneNumber: string;
}

/** 지점장 정보 조회 */
export const getGeneralManagerInquiry = () => {
  return axiosInstance.get<ApiResponse<GeneralManagerInquiryResponse>>(
    '/staffs/v1/general-manager',
  );
};
