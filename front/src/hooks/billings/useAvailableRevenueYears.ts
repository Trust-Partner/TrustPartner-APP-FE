import { useQuery } from '@tanstack/react-query';
import { fetchAvailableRevenueYears } from '../../api/billings';

export const useAvailableRevenueYears = () =>
  useQuery<number[]>({
    queryKey: ['billings', 'revenue', 'available-years'],
    queryFn: fetchAvailableRevenueYears,
    staleTime: 1000 * 60 * 30,
  });
