import axiosInstance from './axiosInstance';

// (관리자) 내 정보 조회
export const getMyInfo = () => {
  return axiosInstance.get('/api/staffs/me');
};

// (사용자) 내 정보 조회
export const getPartnerMyInfo = () => {
  return axiosInstance.get('/api/partners/me');
};

// 등급별 지급 비율표 (관리자)
export const getPartnerGrades = () => {
  return axiosInstance.get('/api/partner-grades');
};

// 차량관리 금액표 (관리자)
export const getCarFeesByGrade = (gradeId: number) => {
  return axiosInstance.get(`/api/car-fees/${gradeId}`);
};
