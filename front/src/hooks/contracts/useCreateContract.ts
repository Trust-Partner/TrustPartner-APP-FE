import { useMutation } from '@tanstack/react-query';
import {
  createContract,
  CreateContractRequest,
} from '../../api/contracts/contract';

export const useCreateContract = () => {
  return useMutation({
    mutationFn: (payload: CreateContractRequest) => createContract(payload),
  });
};
