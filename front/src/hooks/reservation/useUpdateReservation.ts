import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateReservation,
  UpdateReservationPayload,
} from '../../api/reservation';

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reserveId,
      payload,
    }: {
      reserveId: number;
      payload: UpdateReservationPayload;
    }) => updateReservation(reserveId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reservation', 'date'],
      });
    },
  });
};
