import { useMutation } from '@tanstack/react-query';
import {
  createContract,
  CreateContractRequest,
} from '../../api/contracts/contract';

export const useCreateContract = () =>
  useMutation({
    mutationFn: (body: CreateContractRequest) => createContract(body),
  });
