import { useQuery } from '@tanstack/react-query';
import {
  getMonthlyDispatchBillings,
  GetMonthlyDispatchBillingsParams,
  MonthlyDispatchBillingsResponse,
} from '../../api/billings';

export const useMonthlyDispatchBillings = (
  params: GetMonthlyDispatchBillingsParams,
) => {
  return useQuery<MonthlyDispatchBillingsResponse>({
    queryKey: ['billings', 'monthly-dispatch', params.year, params.month],
    queryFn: () => getMonthlyDispatchBillings(params),
  });
};
