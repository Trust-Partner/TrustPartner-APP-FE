import { useQuery } from '@tanstack/react-query';
import { getReservationByDate } from '../../api/reservation';

export const useReservationByDate = (date: string) => {
  return useQuery({
    queryKey: ['reservation', 'date', date],
    queryFn: () => getReservationByDate(date),
    enabled: !!date,
  });
};
