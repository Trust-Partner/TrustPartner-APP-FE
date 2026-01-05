import { useQuery } from '@tanstack/react-query';
import {
  getPartnerGradeComparison,
  GetPartnerGradeComparisonParams,
} from '../../api/billings';

export const usePartnerGradeComparison = (
  params: GetPartnerGradeComparisonParams | null,
) =>
  useQuery({
    queryKey: ['billings', 'partner', 'grade-comparison', params],
    queryFn: () => {
      if (!params) throw new Error('params is null');
      return getPartnerGradeComparison(params);
    },
    enabled: !!params?.compareGradeId,
  });
