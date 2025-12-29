import { useQuery } from '@tanstack/react-query';
import {
  getGeneralManagerInquiry,
  GeneralManagerInquiryResponse,
} from '../../api/inquiry';

export interface GeneralManagerInquiryResult {
  id: string;
  title: string;
  staffName: string;
  phoneNumber: string;
}

export const useGeneralManagerInquiry = () => {
  return useQuery<GeneralManagerInquiryResult>({
    queryKey: ['general-manager-inquiry'],

    queryFn: async () => {
      const res = await getGeneralManagerInquiry();
      const data: GeneralManagerInquiryResponse = res.data.data;

      return {
        id: data.staffRole.code,
        title: data.staffRole.description,
        staffName: data.staffName,
        phoneNumber: data.phoneNumber,
      };
    },
  });
};
