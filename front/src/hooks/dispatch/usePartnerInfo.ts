import { useQuery } from '@tanstack/react-query';
import { getPartnerInfo, PartnerInfoResponse } from '../../api/dispatch';

export const usePartnerInfo = (partnerId?: string) => {
  return useQuery<PartnerInfoResponse>({
    queryKey: ['dispatch', 'partnerInfo', partnerId],
    queryFn: () => getPartnerInfo(partnerId!),
    enabled: !!partnerId,
  });
};
