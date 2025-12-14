import { useQuery } from '@tanstack/react-query';
import {
  getCarStatusByLocation,
  CarStatusByLocation,
} from '../../api/vehicleStatus';

export const useCarStatusByLocation = (locationId: number) => {
  return useQuery<CarStatusByLocation>({
    queryKey: ['carStatusByLocation', locationId],
    queryFn: () => getCarStatusByLocation(locationId),
    enabled: !!locationId,
  });
};
