import { useQuery } from '@tanstack/react-query';
import {
  getPartnerCurrentMonthStatistics,
  GetPartnerCurrentMonthStatisticsParams,
  PartnerCurrentMonthStatistics,
} from '../../api/billings';

export const usePartnerCurrentMonthStatistics = (
  params: GetPartnerCurrentMonthStatisticsParams,
) => {
  return useQuery<PartnerCurrentMonthStatistics>({
    queryKey: [
      'billings',
      'partner',
      'current-month-statistics',
      params.year,
      params.month,
    ],
    queryFn: () => getPartnerCurrentMonthStatistics(params),
    placeholderData: previous => previous,
  });
};

