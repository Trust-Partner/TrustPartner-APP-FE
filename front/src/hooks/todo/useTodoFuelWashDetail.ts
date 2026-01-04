import { useQuery } from '@tanstack/react-query';
import {
  getFuelWashDetail,
  FuelWashDetailResponse,
} from '../../api/todo';

export const useTodoFuelWashDetail = (locationId: number) => {
  return useQuery<FuelWashDetailResponse>({
    queryKey: ['todo', 'fuelWashDetail', locationId],
    queryFn: () => getFuelWashDetail(locationId),
    enabled: !!locationId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

