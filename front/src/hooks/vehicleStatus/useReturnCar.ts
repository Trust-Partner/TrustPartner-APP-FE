import { useMutation, useQueryClient } from '@tanstack/react-query';
import { returnCar } from '../../api/vehicleStatus';

export const useReturnCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: returnCar,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vehicleStatus', 'dispatchCarsByGrade'],
        exact: false,
      });
    },
  });
};
