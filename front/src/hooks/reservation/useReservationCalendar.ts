import { useQuery } from '@tanstack/react-query';
import { getReservationCalendar } from '../../api/reservation';

interface Params {
  startDate: string;
  endDate: string;
}

export const useReservationCalendar = ({ startDate, endDate }: Params) => {
  return useQuery({
    queryKey: ['reservation', 'calendar', startDate, endDate],
    queryFn: () => getReservationCalendar(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};
