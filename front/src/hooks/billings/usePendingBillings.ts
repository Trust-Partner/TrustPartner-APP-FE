import { useQuery } from '@tanstack/react-query';
import {
  getPendingBillings,
  PendingBillingsResponse,
} from '../../api/billings';

export const usePendingBillings = () => {
  return useQuery<PendingBillingsResponse>({
    queryKey: ['billings', 'pending'],
    queryFn: getPendingBillings,
  });
};
