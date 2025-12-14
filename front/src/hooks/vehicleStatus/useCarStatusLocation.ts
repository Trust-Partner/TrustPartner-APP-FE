import { useQuery } from '@tanstack/react-query';
import {
  getCarStatusLocation,
  LocationStatusItem,
} from '../../api/vehicleStatus';

export const useCarStatusLocation = (carNum?: string) => {
  return useQuery<LocationStatusItem[]>({
    queryKey: ['carStatusLocation', carNum],
    queryFn: () => getCarStatusLocation(carNum),
  });
};
