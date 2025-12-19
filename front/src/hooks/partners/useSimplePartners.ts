import { useQuery } from '@tanstack/react-query';
import { fetchSimplePartners } from '../../api/partners';

export const useSimplePartners = (keyword: string) => {
  return useQuery({
    queryKey: ['partners', 'simple', keyword],
    queryFn: () => fetchSimplePartners(keyword),
    enabled: keyword.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
};
