import { useQuery } from '@tanstack/react-query';
import { PartnerMeResponse, getPartnerMyInfo } from '../../api/mypage';

export const usePartnerMe = () => {
  return useQuery<PartnerMeResponse>({
    queryKey: ['mypage', 'partnerMe'],
    queryFn: getPartnerMyInfo,
    staleTime: 60 * 1000,
  });
};
