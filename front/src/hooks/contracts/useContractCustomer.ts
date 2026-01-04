import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getContractCustomer,
  updateContractCustomer,
  ContractCustomer,
} from '../../api/contracts/detail';

export const useContractCustomer = (contractId: number) =>
  useQuery<ContractCustomer>({
    queryKey: ['contract', 'customer', contractId],
    queryFn: () => getContractCustomer(contractId),
    enabled: !!contractId,
  });

export const useUpdateContractCustomer = (contractId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      customerName: string;
      customerPhoneNumber: string;
      customerAddress: string;
    }) => updateContractCustomer(contractId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contract', 'customer', contractId],
      });
    },
  });
};
