import { useMutation } from '@tanstack/react-query';
import {
  saveGeneralContract,
  SaveGeneralContractRequest,
} from '../../api/contract';

export const useSaveGeneralContract = (contractId: number) => {
  return useMutation({
    mutationFn: (payload: SaveGeneralContractRequest) =>
      saveGeneralContract(contractId, payload),
  });
};
