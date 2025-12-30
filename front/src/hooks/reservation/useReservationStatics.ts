import { useQuery } from '@tanstack/react-query';
import { getReservationStatics } from '../../api/reservation';

export const useReservationStatics = () => {
  return useQuery({
    queryKey: ['reservation', 'statics'],
    queryFn: getReservationStatics,
  });
};
