import { useQuery } from '@tanstack/react-query';
import {
  getDispatchCarGrades,
  DispatchCarGradeResponse,
  DispatchCarType,
} from '../../api/vehicleStatus';

export const useDispatchCarGrades = (carType: DispatchCarType) =>
  useQuery<DispatchCarGradeResponse>({
    queryKey: ['vehicleStatus', 'dispatchCarGrades', carType],
    queryFn: () => getDispatchCarGrades(carType),
    enabled: !!carType,
  });
