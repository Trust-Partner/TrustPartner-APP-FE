import { useQuery } from '@tanstack/react-query';
import { getReturnRequests, ReturnRequestResponse } from '../../api/todo';

export const useTodoReturns = () => {
  return useQuery<ReturnRequestResponse>({
    queryKey: ['todo', 'returns'],
    queryFn: getReturnRequests,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

