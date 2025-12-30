import axiosInstance from './axiosInstance';

// Simple Partner (필터/검색용)
export interface SimplePartner {
  partnerId: string;
  partnerName: string;
}

export const fetchSimplePartners = async (
  partnerName?: string,
): Promise<SimplePartner[]> => {
  const res = await axiosInstance.get('/partners/v1/simple', {
    params: partnerName ? { partnerName } : undefined,
  });

  return res.data.data;
};

// Staff Partner (목록/상세용)
export interface StaffPartner {
  partnerId: string;
  partnerName: string;
  phoneNumber: string;
  address: string;
  teamLeaderName: string;
  gradeInfo: {
    gradeId: number;
    gradeName: string;
    discountRate: number;
  };
}

export const fetchStaffPartners = async (
  partnerName?: string,
): Promise<StaffPartner[]> => {
  const res = await axiosInstance.get('/staffs/v1/partners', {
    params: partnerName ? { partnerName } : undefined,
  });

  return res.data.data;
};
