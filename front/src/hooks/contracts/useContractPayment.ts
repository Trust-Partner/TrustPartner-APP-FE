import { useQuery } from '@tanstack/react-query';
import {
  getContractPayment,
  ContractPayment,
} from '../../api/contracts/detail';

export const useContractPayment = (contractId: number) =>
  useQuery<ContractPayment>({
    queryKey: ['contract', 'payment', contractId],
    queryFn: () => getContractPayment(contractId),
    enabled: !!contractId,
  });
