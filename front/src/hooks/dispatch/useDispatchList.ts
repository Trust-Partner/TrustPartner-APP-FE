import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getDispatchRequests, DispatchListResponse } from '../../api/dispatch';

export const useDispatchList = () => {
  return useQuery<DispatchListResponse>({
    queryKey: ['dispatchList'],
    queryFn: () => getDispatchRequests('ALL'),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
