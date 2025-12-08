import { useQuery } from '@tanstack/react-query';
import { getDispatchRequests, DispatchListResponse } from '../../api/dispatch';

export const useDispatchList = () => {
  return useQuery<DispatchListResponse>({
    queryKey: ['dispatch', 'list'],
    queryFn: () => getDispatchRequests('ALL'),
    staleTime: 10000,
  });
};
