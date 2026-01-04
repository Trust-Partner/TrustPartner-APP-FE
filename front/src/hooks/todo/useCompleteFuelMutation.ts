import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeFuel } from '../../api/todo';

export const useCompleteFuelMutation = (locationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (carId: number) => completeFuel(carId),
    onSuccess: () => {
      // 상세 화면 리스트 조회 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['todo', 'fuelWashDetail', locationId],
      });
      // 메인 화면 리스트 조회 쿼리 무효화 (TodoScreen)
      queryClient.invalidateQueries({
        queryKey: ['todo', 'fuelWash'],
      });
    },
  });
};

