import { useQuery } from '@tanstack/react-query';
import { getContractList, ContractListItem } from '../../api/contracts/list';

interface UseContractListParams {
  startDate?: string | null;
  endDate?: string | null;
}

export const useContractList = ({
  startDate,
  endDate,
}: UseContractListParams) => {
  return useQuery<ContractListItem[]>({
    queryKey: ['contractList', startDate, endDate],
    queryFn: () =>
      getContractList({
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      }),
    staleTime: 0,
  });
};
