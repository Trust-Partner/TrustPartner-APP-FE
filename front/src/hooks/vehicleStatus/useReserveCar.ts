import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reserveCar } from '../../api/vehicleStatus';

export const useReserveCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reserveCar,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vehicleStatus', 'dispatchCarsByGrade'],
        exact: false,
      });
    },
  });
};
