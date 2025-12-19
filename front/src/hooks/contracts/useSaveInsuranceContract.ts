import { useMutation } from '@tanstack/react-query';
import {
  saveInsuranceContract,
  SaveInsuranceContractRequest,
} from '../../api/contract';

export const useSaveInsuranceContract = (contractId: number) => {
  return useMutation({
    mutationFn: (payload: SaveInsuranceContractRequest) =>
      saveInsuranceContract(contractId, payload),
  });
};
