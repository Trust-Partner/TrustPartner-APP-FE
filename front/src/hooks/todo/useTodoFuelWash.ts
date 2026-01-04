import { useQuery } from '@tanstack/react-query';
import { getFuelWashRequests, FuelWashResponse } from '../../api/todo';

export const useTodoFuelWash = () => {
  return useQuery<FuelWashResponse>({
    queryKey: ['todo', 'fuelWash'],
    queryFn: getFuelWashRequests,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

