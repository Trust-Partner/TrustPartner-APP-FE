import { useMutation } from '@tanstack/react-query';
import {
  CreateReplacementContractRequest,
  createReplacementContract,
} from '../../api/contracts/contract';

export const useCreateReplacementContract = () =>
  useMutation({
    mutationFn: (body: CreateReplacementContractRequest) =>
      createReplacementContract(body),
  });
