import axiosInstance from './axiosInstance';

export interface SimplePartner {
  partnerId: string;
  partnerName: string;
}

export const fetchSimplePartners = async (
  partnerName: string,
): Promise<SimplePartner[]> => {
  const res = await axiosInstance.get('/partners/v1/simple', {
    params: { partnerName },
  });

  return res.data.data;
};
