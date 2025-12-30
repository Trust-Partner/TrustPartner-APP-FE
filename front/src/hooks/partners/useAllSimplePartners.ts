import { useQuery } from '@tanstack/react-query';
import { fetchSimplePartners, SimplePartner } from '../../api/partners';

export const useAllSimplePartners = (partnerName?: string) =>
  useQuery<SimplePartner[]>({
    queryKey: ['partners', 'simple', partnerName ?? 'all'],
    queryFn: () => fetchSimplePartners(partnerName),
    staleTime: 1000 * 60 * 5,
  });
