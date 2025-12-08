import { useQuery } from '@tanstack/react-query';
import { StaffMeResponse, getMyInfo } from '../../api/mypage';

export const useStaffMe = () => {
  return useQuery<StaffMeResponse>({
    queryKey: ['mypage', 'staffMe'],
    queryFn: getMyInfo,
    staleTime: 60 * 1000,
  });
};
