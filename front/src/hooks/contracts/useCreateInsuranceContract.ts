import { useMutation } from '@tanstack/react-query';
import {
  CreateInsuranceContractRequest,
  createInsuranceContract,
} from '../../api/contracts/contract';

export const useCreateInsuranceContract = () =>
  useMutation({
    mutationFn: (body: CreateInsuranceContractRequest) =>
      createInsuranceContract(body),
  });
