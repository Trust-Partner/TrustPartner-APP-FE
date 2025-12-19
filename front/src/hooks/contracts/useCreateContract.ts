import { useMutation } from '@tanstack/react-query';
import { createContract, CreateContractRequest } from '../../api/contract';

export const useCreateContract = () => {
  return useMutation({
    mutationFn: (payload: CreateContractRequest) => createContract(payload),
  });
};
