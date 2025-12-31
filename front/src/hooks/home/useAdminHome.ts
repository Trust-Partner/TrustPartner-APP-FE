import { useQuery } from '@tanstack/react-query';
import { AdminHomeDashboard, getAdminHome } from '../../api/home';

export const useAdminHome = (date: string) =>
  useQuery<AdminHomeDashboard>({
    queryKey: ['admin', 'home', date],
    queryFn: () => getAdminHome(date),
  });
