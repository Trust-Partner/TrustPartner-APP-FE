import { useQuery } from '@tanstack/react-query';
import {
  fetchMonthlyRevenueStatistics,
  FetchMonthlyRevenueParams,
  MonthlyRevenueResponse,
} from '../../api/billings';

export const useMonthlyRevenueStatistics = (
  params: FetchMonthlyRevenueParams,
) =>
  useQuery<MonthlyRevenueResponse>({
    queryKey: [
      'billings',
      'revenue',
      'monthly',
      params.year,
      params.partnerIds ?? 'all',
    ],
    queryFn: () => fetchMonthlyRevenueStatistics(params),
    placeholderData: previous => previous,
  });
