import { useQuery } from '@tanstack/react-query';
import {
  getReturnDetail,
  ReturnDetailResponse,
} from '../../api/todo';

export const useTodoReturnDetail = (locationId: number) => {
  return useQuery<ReturnDetailResponse>({
    queryKey: ['todo', 'returnDetail', locationId],
    queryFn: () => getReturnDetail(locationId),
    enabled: !!locationId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

