import { useMutation, useQueryClient } from '@tanstack/react-query';
import { replaceCar, ReplaceCarPayload } from '../../api/vehicleStatus';

export const useReplaceCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReplaceCarPayload) => replaceCar(payload),
    onSuccess: () => {
      // 차량현황 다시 갱신
      queryClient.invalidateQueries({
        queryKey: ['carStatusByLocation'],
      });
      queryClient.invalidateQueries({
        queryKey: ['carsByLocation'],
      });
    },
  });
};
