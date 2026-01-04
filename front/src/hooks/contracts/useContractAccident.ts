import { useQuery } from '@tanstack/react-query';
import {
  getContractAccidentCar,
  ContractAccidentCar,
} from '../../api/contracts/detail';

export const useContractAccidentCar = (contractId: number) =>
  useQuery<ContractAccidentCar>({
    queryKey: ['contract', 'accidentCar', contractId],
    queryFn: () => getContractAccidentCar(contractId),
    enabled: !!contractId,
  });
