import { useQuery } from '@tanstack/react-query';
import { getUserHome } from '../../api/home';

export const useUserHome = (userId: string, date: string) =>
  useQuery({
    queryKey: ['userHome', userId, date],
    queryFn: () => getUserHome(userId, date),
    enabled: !!userId,
  });
