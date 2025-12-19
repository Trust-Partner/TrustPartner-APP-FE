import { useMutation } from '@tanstack/react-query';
import { fetchContractUploadUrls } from '../../api/contract';

export const useContractUploadUrls = () => {
  return useMutation({
    mutationFn: (contractId: number) => fetchContractUploadUrls(contractId),
  });
};
