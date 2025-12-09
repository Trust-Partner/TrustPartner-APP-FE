import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestUserDispatch } from '../../api/dispatch';

export const useUserDispatchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestUserDispatch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dispatchList'],
      });
    },
  });
};
