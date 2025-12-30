import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReservation } from '../../api/reservation';

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reserveId: number) => deleteReservation(reserveId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation'] });
    },
  });
};
