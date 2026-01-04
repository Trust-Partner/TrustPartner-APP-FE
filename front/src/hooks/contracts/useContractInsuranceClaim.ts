import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getContractInsuranceClaim,
  updateContractInsuranceClaim,
  ContractInsuranceClaim,
  UpdateInsuranceClaimRequest,
} from '../../api/contracts/detail';

export const useContractInsuranceClaim = (contractId: number) =>
  useQuery<ContractInsuranceClaim>({
    queryKey: ['contract', 'insuranceClaim', contractId],
    queryFn: () => getContractInsuranceClaim(contractId),
    enabled: !!contractId,
  });

export const useUpdateContractInsuranceClaim = (contractId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateInsuranceClaimRequest) =>
      updateContractInsuranceClaim(contractId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contract', 'insuranceClaim', contractId],
      });
    },
  });
};
