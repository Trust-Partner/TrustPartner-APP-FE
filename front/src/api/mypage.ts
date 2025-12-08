import axiosInstance from './axiosInstance';

// 공통 API 응답 타입
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 관리자 - 내 정보 타입
export interface StaffMeResponse {
  staffId: string;
  staffName: string;
  staffRole: {
    code: string;
    description: string;
  };
  branch: string;
  phoneNumber: string;
  loginId: string;
}

// 관리자 - 내 정보 조회
export const getMyInfo = async (): Promise<StaffMeResponse> => {
  const res = await axiosInstance.get<ApiResponse<StaffMeResponse>>(
    '/api/staffs/me',
  );
  return res.data.data;
};

// 파트너 - 내 정보 타입
export interface PartnerMeResponse {
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

// 파트너 - 내 정보 조회
export const getPartnerMyInfo = async (): Promise<PartnerMeResponse> => {
  const res = await axiosInstance.get<ApiResponse<PartnerMeResponse>>(
    '/api/partners/me',
  );
  return res.data.data;
};

// 등급 타입
export interface PartnerGrade {
  gradeId: number;
  gradeName: string;
  description: string;
  discountRate: number;
  partnerNames: string[];
  count: number;
}

// 등급 목록 조회
export const getPartnerGrades = async (): Promise<PartnerGrade[]> => {
  const res = await axiosInstance.get<ApiResponse<PartnerGrade[]>>(
    '/api/partner-grades',
  );
  return res.data.data;
};

// 차량 금액 타입
export interface CarFeeItem {
  carGradeId: number;
  gradeName: string;
  managementFee: number;
}

export interface CarFeeResponse {
  gradeId: number;
  grades: CarFeeItem[];
}

// 차량 금액 조회
export const getCarFeesByGrade = async (
  gradeId: number,
): Promise<CarFeeResponse> => {
  const res = await axiosInstance.get<ApiResponse<CarFeeResponse>>(
    `/api/car-fees/${gradeId}`,
  );
  return res.data.data;
};
