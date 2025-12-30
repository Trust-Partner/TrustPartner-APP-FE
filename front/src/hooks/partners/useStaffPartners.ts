import { useQuery } from '@tanstack/react-query';
import { fetchStaffPartners, StaffPartner } from '../../api/partners';

export const useStaffPartners = () =>
  useQuery<StaffPartner[]>({
    queryKey: ['partners', 'staffs'],
    queryFn: () => fetchStaffPartners(),
    staleTime: 1000 * 60 * 5,
  });
