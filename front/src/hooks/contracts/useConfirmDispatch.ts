import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  confirmDispatch,
  ConfirmDispatchRequest,
  ConfirmDispatchResponse,
} from '../../api/contract';
import { useContractModalStore } from '../../stores/useContractModalStore';

export const useConfirmDispatch = () => {
  const queryClient = useQueryClient();
  const setDispatchId = useContractModalStore(s => s.setDispatchId);

  return useMutation<ConfirmDispatchResponse, Error, ConfirmDispatchRequest>({
    mutationFn: confirmDispatch,

    onSuccess: res => {
      setDispatchId(res.dispatchId);

      queryClient.invalidateQueries({
        queryKey: ['dispatchList'],
      });

      queryClient.invalidateQueries({
        queryKey: ['vehicleStatus', 'dispatchCarsByGrade'],
        exact: false,
      });
    },
  });
};
