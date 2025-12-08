import { useQuery } from '@tanstack/react-query';
import { getPartnerGrades, PartnerGrade } from '../../api/mypage';

export const usePartnerGrades = () => {
  return useQuery<PartnerGrade[]>({
    queryKey: ['mypage', 'grades'],
    queryFn: getPartnerGrades,
    staleTime: Infinity,
  });
};
