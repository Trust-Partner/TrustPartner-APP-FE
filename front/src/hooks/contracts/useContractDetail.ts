import { useQuery } from '@tanstack/react-query';
import { fetchContractDetail } from '../../api/contract';

export const useContractDetail = (contractId?: number | null) => {
  return useQuery({
    queryKey: ['contractDetail', contractId],
    queryFn: () => fetchContractDetail(contractId!),
    enabled: typeof contractId === 'number',
    staleTime: 1000 * 60 * 5,
  });
};
