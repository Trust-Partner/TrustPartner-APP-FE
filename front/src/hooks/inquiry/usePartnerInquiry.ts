import { useQuery } from '@tanstack/react-query';
import { getPartnerInquiry, PartnerInquiryResponse } from '../../api/inquiry';

export interface PartnerInquiryResult {
  id: string;
  title: string;
  staffName: string;
  phoneNumber: string;
}

export const usePartnerInquiry = (partnerId?: string) => {
  return useQuery<PartnerInquiryResult>({
    queryKey: ['partner-inquiry', partnerId],
    enabled: !!partnerId,

    queryFn: async () => {
      const res = await getPartnerInquiry(partnerId!);
      const data: PartnerInquiryResponse = res.data.data;

      return {
        id: data.teamLeaderInfo.staffRole.code,
        title: data.teamLeaderInfo.staffRole.description,
        staffName: data.teamLeaderInfo.staffName,
        phoneNumber: data.phoneNumber,
      };
    },
  });
};
