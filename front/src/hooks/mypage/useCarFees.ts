import { useQuery } from '@tanstack/react-query';
import { CarFeeResponse, getCarFeesByGrade } from '../../api/mypage';

export const useCarFees = (gradeId?: number) => {
  return useQuery<CarFeeResponse>({
    queryKey: ['mypage', 'carFees', gradeId],
    queryFn: () => getCarFeesByGrade(gradeId!),
    enabled: gradeId !== undefined,
    placeholderData: previous => previous,
  });
};
