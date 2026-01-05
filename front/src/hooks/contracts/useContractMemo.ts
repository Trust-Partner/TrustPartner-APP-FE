import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getContractMemos,
  createContractMemo,
  ContractMemo,
} from '../../api/contracts/detail';

export const useContractMemos = (contractId: number) =>
  useQuery<ContractMemo[]>({
    queryKey: ['contract', 'memo', contractId],
    queryFn: () => getContractMemos(contractId),
    enabled: !!contractId,
  });

export const useCreateContractMemo = (contractId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { memo: string; staffId: string }) =>
      createContractMemo(contractId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contract', 'memo', contractId],
      });
    },
  });
};
