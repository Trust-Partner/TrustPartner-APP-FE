import { useMutation } from '@tanstack/react-query';
import {
  CreateGeneralContractRequest,
  createGeneralContract,
} from '../../api/contracts/contract';

export const useCreateGeneralContract = () =>
  useMutation({
    mutationFn: (body: CreateGeneralContractRequest) =>
      createGeneralContract(body),
  });
