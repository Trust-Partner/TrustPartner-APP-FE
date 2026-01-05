import { useQuery } from '@tanstack/react-query';
import {
  getPartnerMonthlyStatistics,
  GetPartnerMonthlyStatisticsParams,
  PartnerMonthlyStatistics,
} from '../../api/billings';

export const usePartnerMonthlyStatistics = (
  params: GetPartnerMonthlyStatisticsParams,
) => {
  return useQuery<PartnerMonthlyStatistics>({
    queryKey: ['billings', 'partner', 'monthly-statistics', params.year],
    queryFn: () => getPartnerMonthlyStatistics(params),
    placeholderData: previous => previous,
  });
};

