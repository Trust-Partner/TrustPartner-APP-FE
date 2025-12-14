import { useQuery } from '@tanstack/react-query';
import {
  getDispatchCarsByGrade,
  DispatchCarsByGradeResponse,
} from '../../api/vehicleStatus';

export const useDispatchCarsByGrade = (gradeId: number) =>
  useQuery<DispatchCarsByGradeResponse>({
    queryKey: ['vehicleStatus', 'dispatchCarsByGrade', gradeId],
    queryFn: () => getDispatchCarsByGrade(gradeId),
    enabled: !!gradeId,
  });
