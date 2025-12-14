import { useQuery } from '@tanstack/react-query';
import { getCarStatusSummary, CarStatusSummary } from '../../api/vehicleStatus';

export const useCarStatusSummary = () => {
  return useQuery<CarStatusSummary>({
    queryKey: ['carStatusSummary'],
    queryFn: getCarStatusSummary,
  });
};
