import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectDispatchRequest } from '../../api/dispatch';

export const useRejectDispatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dispatchId: number) => rejectDispatchRequest(dispatchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatchList'] });
    },
  });
};
