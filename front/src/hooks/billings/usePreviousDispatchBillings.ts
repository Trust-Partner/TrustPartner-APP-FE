import { useQuery } from '@tanstack/react-query';
import {
  getPreviousDispatchBillings,
  GetMonthlyDispatchBillingsParams,
  MonthlyDispatchBillingsResponse,
} from '../../api/billings';

export const usePreviousDispatchBillings = (
  params: GetMonthlyDispatchBillingsParams,
) => {
  return useQuery<MonthlyDispatchBillingsResponse>({
    queryKey: ['billings', 'previous-dispatch', params.year, params.month],
    queryFn: () => getPreviousDispatchBillings(params),
  });
};
